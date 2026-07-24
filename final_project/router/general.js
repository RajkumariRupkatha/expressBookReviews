const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Unable to register user."
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists!"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books, null, 4));
});

// Task 2: Get a book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].author === author) {
            matchingBooks[isbn] = books[isbn];
        }
    });

    return res.send(JSON.stringify(matchingBooks, null, 4));
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = {};

    Object.keys(books).forEach((isbn) => {
        if (books[isbn].title === title) {
            matchingBooks[isbn] = books[isbn];
        }
    });

    return res.send(JSON.stringify(matchingBooks, null, 4));
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

// Task 10: Get all books using Async/Await with Axios
const getAllBooks = async () => {
    try {
        const response = await axios.get("http://localhost:5000/");
        return response.data;
    } catch (error) {
        console.error("Error retrieving books:", error.message);
        throw error;
    }
};

// Task 11: Get a book by ISBN using Async/Await with Axios
const getBookByISBN = async (isbn) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/isbn/${isbn}`
        );

        return response.data;
    } catch (error) {
        console.error("Error retrieving book by ISBN:", error.message);
        throw error;
    }
};

// Task 12: Get books by author using Async/Await with Axios
const getBooksByAuthor = async (author) => {
    try {
        const encodedAuthor = encodeURIComponent(author);

        const response = await axios.get(
            `http://localhost:5000/author/${encodedAuthor}`
        );

        return response.data;
    } catch (error) {
        console.error("Error retrieving books by author:", error.message);
        throw error;
    }
};

// Task 13: Get books by title using Async/Await with Axios
const getBooksByTitle = async (title) => {
    try {
        const encodedTitle = encodeURIComponent(title);

        const response = await axios.get(
            `http://localhost:5000/title/${encodedTitle}`
        );

        return response.data;
    } catch (error) {
        console.error("Error retrieving books by title:", error.message);
        throw error;
    }
};

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;