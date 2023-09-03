const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the specified ISBN exists in the books object
  if (books[isbn]) {
    // Get the user's username from the session (assuming it's stored in req.user.username)
    const username = req.user.username;

    // Get the review text from the request query
    const reviewText = req.query.review;

    // Check if the user has already posted a review for the same ISBN
    if (books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = reviewText;
      // Send a success response indicating the review was updated
      return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been updated/added` });
    } else {
      // Add a new review for the user under the specified ISBN
      books[isbn].reviews[username] = reviewText;
      // Send a success response indicating the review was added
      return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added` });
    }
  } else {
    // Book with the specified ISBN not found
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book with the specified ISBN exists in the books object
  if (books[isbn]) {
    // Get the user's username from the session (assuming it's stored in req.user.username)
    const username = req.user.username;
    //const username = req.session.username;

    // Check if the user has posted a review for the same ISBN
    if (books[isbn].reviews[username]) {
      // Delete the user's review for the specified ISBN
      delete books[isbn].reviews[username];
      // Send a success response indicating the review was deleted
      return res.status(200).json({
        message: `Review for the ISBN ${isbn} posted by the user test deleted`,
      });
    } else {
      // No review found for the user and the specified ISBN
      return res.status(404).json({
        message: `No review found for the book with ISBN ${isbn}`,
      });
    }
  } else {
    // Book with the specified ISBN not found
    return res.status(404).json({ message: "Book not found" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
