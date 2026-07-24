const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

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

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

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

    if (Object.keys(matchingBooks).length === 0) {
        return res.status(404).json({
            message: "No books found for the specified author"
        });
    }

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

    if (Object.keys(matchingBooks).length === 0) {
        return res.status(404).json({
            message: "No books found for the specified title"
        });
    }

    return res.send(JSON.stringify(matchingBooks, null, 4));
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.send(books[isbn].reviews);
});

// Task 10:
// Get all books using Async/Await with Axios
public_users.get('/books', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);

        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving all books",
            error: error.message
        });
    }
});

// Task 11:
// Get a book by ISBN using Promises with Axios
public_users.get('/books/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => {
            if (!response.data) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            return res.status(200).json(response.data);
        })
        .catch((error) => {
            const statusCode = error.response
                ? error.response.status
                : 500;

            return res.status(statusCode).json({
                message: "Error retrieving book by ISBN",
                error: error.message
            });
        });
});

// Task 12:
// Get books by author using Async/Await with Axios
public_users.get('/books/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const encodedAuthor = encodeURIComponent(author);

        const response = await axios.get(
            `${BASE_URL}/author/${encodedAuthor}`
        );

        if (
            !response.data ||
            Object.keys(response.data).length === 0
        ) {
            return res.status(404).json({
                message: "No books found for the specified author"
            });
        }

        return res.status(200).json(response.data);
    } catch (error) {
        const statusCode = error.response
            ? error.response.status
            : 500;

        return res.status(statusCode).json({
            message: "Error retrieving books by author",
            error: error.message
        });
    }
});

// Task 13:
// Get books by title using Async/Await with Axios
public_users.get('/books/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const encodedTitle = encodeURIComponent(title);

        const response = await axios.get(
            `${BASE_URL}/title/${encodedTitle}`
        );

        if (
            !response.data ||
            Object.keys(response.data).length === 0
        ) {
            return res.status(404).json({
                message: "No books found for the specified title"
            });
        }

        return res.status(200).json(response.data);
    } catch (error) {
        const statusCode = error.response
            ? error.response.status
            : 500;

        return res.status(statusCode).json({
            message: "Error retrieving books by title",
            error: error.message
        });
    }
});

module.exports.general = public_users;