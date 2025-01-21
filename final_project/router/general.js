const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for the given title" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//Get book list using promise
public_users.get('/promise/books', function (req, res) {
    axios.get('https://l200220134-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
      .then(response => {
        res.status(200).json(response.data); // Kirim respons dari server eksternal ke klien
      })
      .catch(error => {
        console.error("Axios error:", error.message);
        res.status(500).json({ 
          message: "Error retrieving book list", 
          error: error.message 
        });
      });
  });

// Get book details by ISBN (using Promise)
public_users.get('/promise/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
  
    axios.get(`https://l200220134-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({
          message: "Error retrieving book details by ISBN",
          error: error.message
        });
      });
});

// Get book details by author (using Promise)
public_users.get('/promise/author/:author', (req, res) => {
    const { author } = req.params;
  
    axios.get(`https://l200220134-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`)
      .then(response => {
        res.status(200).json(response.data);
      })
      .catch(error => {
        res.status(500).json({
          message: "Error retrieving books by author",
          error: error.message
        });
      });
  });
  

module.exports.general = public_users;
