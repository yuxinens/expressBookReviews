const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const jwtSecret = process.env.JWT_SECRET || 'my_secret_key';

let users = [
    { 
        username: "newuser", 
        password: "password123" 
    }
];

//returns boolean
const isValid = (username) => {
    return users.some(user => user.username === username);
};

//returns boolean
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(404).json({ message: "User does not exist" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Ambil username dari token

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
