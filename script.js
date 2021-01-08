// Constants //

const newBookBtn = document.querySelector("#new-book-btn");
const form = document.querySelector("#new-book");
const newTitle = document.querySelector("#title");
const newAuthor = document.querySelector("#author");
const newPages = document.querySelector("#pages");
const newRead = document.querySelector("#read");
const newBookSubmit = document.querySelector("#new-book-submit");
const cancelBtn = document.querySelector("#cancel");
const popup = document.querySelector(".popup");
const table = document.querySelector("#table");
const headerRow = document.querySelector("#header-row");

// Set the configuration for your app
var config = {
  apiKey: "AIzaSyCr8yzy9Gu64BlPv4jWP5h8YJIOjoruJpE",
  authDomain: "reading-list-56057.firebaseapp.com",
  databaseURL: "https://reading-list-56057-default-rtdb.firebaseio.com/",
  storageBucket: "reading-list-56057.appspot.com"
};
try {
  firebase.initializeApp(config);
} catch(err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase intialization error raised',err.stack)
  }
}

// Get a reference to the database service
var database = firebase.database();

const dbRef = firebase.database().ref();

// Processes //
let myLibrary = [
  {
    "title":"Moby Dick",
    "author":"Herman Melville",
    "pages":750,
    "read":false,
  },
  {
    "title":"The Holy Bible",
    "author":"God",
    "pages":1623,
    "read":false,
  }
];

dbRef.on('value', (snap) => {
  myLibrary = snap.val();
  console.log(myLibrary);
  displayLibrary(myLibrary);
});


[newBookBtn, cancelBtn].map(element => {
  element.addEventListener("click", function() {togglePopup()});
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  let newBook = new Book(newTitle.value, newAuthor.value, newPages.value,
      newRead.checked);
  addBookToLibrary(newBook);
  form.reset();
  popup.hidden = !popup.hidden;
});

// Callable Functions //

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function togglePopup() {
  return popup.hidden = !popup.hidden;
}

function addDeleteListener(element) {
  element.addEventListener("click", function(e) {
    let row = e.target.parentElement.parentElement;
    let index = row.getAttribute('data-index');
    database.ref(index).remove();
  })};

function addBookToLibrary(newBook) {
  newBookKey = dbRef.push().key;
  return database.ref(newBookKey).set(newBook);
}

function displayLibrary(library) {
  while (table.rows[1]) {
    table.deleteRow(1);
  }
  Object.keys(library).map(key => {
    console.log(library[key]);
    newRow(library[key], key);
  });
}

function newRow(book, key) {
  let row = document.createElement('tr');
  row.setAttribute('data-index', key);
  fillCell('title');
  fillCell('author');
  fillCell('pages');
  fillCell('read');
  fillCell('delete')
  table.appendChild(row);

  function fillCell(attribute) {
    data = document.createElement('td');
    if (attribute === 'read') {
      checkbox = document.createElement('input');
      checkbox.setAttribute('type','checkbox');
      checkbox.checked = book[attribute];
      checkbox.classList.add('check');
      addReadToggle(checkbox);
      data.appendChild(checkbox);
    }
    else if (attribute === 'delete') {
      data.classList.add('del-btn-container')
      let delBtn = document.createElement('button');
      delBtn.textContent = 'DELETE';
      delBtn.classList.add('del-btn');
      addDeleteListener(delBtn);
      data.appendChild(delBtn);
    }
    else {
      data.textContent = book[attribute];
    }
    row.appendChild(data);
  }
}

function addReadToggle(element) {
  element.addEventListener("click", function(e) {
    let row = e.target.parentElement.parentElement;
    let key = row.getAttribute('data-index');
    database.ref(key).update({'read': !myLibrary[key].read});
  })
}
