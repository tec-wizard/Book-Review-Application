const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //res.send(JSON.stringify(books, null, 4));
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
    //Console log before calling the promise
    console.log("Before calling promise");
        //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
    res.send(JSON.stringify(books, null, 4));
  })
    //Console log after calling the promise
    console.log("After calling promise");

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },6000)})
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        // Retrieve the ISBN from the request parameters
        const isbn = req.params.isbn;

        // Check if the book with the specified ISBN exists
        if (books[isbn]) {
            // Send the book details as the response
            //return res.status(200).json(books[isbn]);
            res.send(books[isbn]);
        } else {
            // Book with the specified ISBN not found
            return res.status(404).json({ message: "Book not found" });
        }
    })
    //Console log after calling the promise
    console.log("After calling promise");
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },6000)})
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        // Get book details based on author
        // Retrieve the author from the request parameters
        const author = req.params.author;

        // Array to store books with matching author
        const booksByAuthor = [];

        // Iterate through the books object
        for (const isbn in books) {
            if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            // Check if the author matches the one provided in the request parameters
            if (book.author === author) {
                booksByAuthor.push(book);
            }
            }
        }

        // Check if any books were found for the provided author
        if (booksByAuthor.length > 0) {
            // Send the book details as the response
            return res.status(200).json({ booksbyauthor: booksByAuthor });  
        } else {
            // No books found for the specified author
            return res.status(404).json({ message: "No books found for the author" });
        }
    })
    //Console log after calling the promise
    console.log("After calling promise");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
        resolve("Promise resolved")
        },6000)})
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        // Get book details based on title
        // Retrieve the title from the request parameters
        const title = req.params.title;

        // Array to store books with matching author
        const booksByTitle = [];

        // Iterate through the books object
        for (const isbn in books) {
            if (books.hasOwnProperty(isbn)) {
            const book = books[isbn];
            // Check if the title matches the one provided in the request parameters
                if (book.title === title) {
                    booksByTitle.push(book);
                }
            }
        }

        // Check if any books were found for the provided author
        if (booksByTitle.length > 0) {
            // Send the book details as the response
            return res.status(200).json({ booksbytitle: booksByTitle });
        } else {
            // No books found for the specified author
            return res.status(404).json({ message: "No books found for the author" });
        }
    })
    //Console log after calling the promise
    console.log("After calling promise");
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
// Retrieve the ISBN from the request parameters
const isbn = req.params.isbn;

// Check if the book with the specified ISBN exists in the books object
    if (books[isbn]) {
    // Retrieve the reviews for the book
    const bookReviews = books[isbn].reviews;

    // Send the book reviews as the response
    return res.status(200).json({ reviews: bookReviews });
    } else {
    // Book with the specified ISBN not found
    return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;