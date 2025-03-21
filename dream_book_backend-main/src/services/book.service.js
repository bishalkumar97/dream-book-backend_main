const { Book } = require('../models');
const httpStatus = require('http-status');
const { fileUploadService } = require('../microservices');

const ApiError = require('../utils/ApiError');
const { getAllData } = require("../utils/getAllData");

async function addBook(book) {
    return await Book.create(book);
}

async function getBookById(id) {
    return await Book.findById(id).populate({ path: "author" });
}


// async function updateUserById(id, newDetails, profileImage = null) {
//   const user = await User.findById(id);
//   userValidator(user);
//   let updates = { ...newDetails };
//   return await User.findByIdAndUpdate(id, updates, { new: true });

// }

async function updateBookById(id, newDetails) {
    return await Book.findByIdAndUpdate(id, newDetails, { new: true });
}

async function deleteBook(id, newDetails) {
    return await Book.findByIdAndDelete(id);
}

// async function getAllBooks(query, populateConfig) {
//     const data = await getAllData(Book, query, populateConfig)
//     return data;
// }

async function getAllBooks(query, populateConfig) {
    console.log("Received query for fetching books:", query); // Debug log the received query

    // If a search parameter is provided, add a regex search to the query.
    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i'); // case-insensitive search
        console.log("Constructed search regex:", searchRegex); // Debug log the constructed regex

        query.$or = [
            { title: { $regex: searchRegex } },
            { author: { $regex: searchRegex } },
            { description: { $regex: searchRegex } }
        ];
        // Optionally, remove the search field so it doesn't interfere later
        delete query.search;
    }
    const data = await getAllData(Book, query, populateConfig);
    return data;
}


module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBook
    //   getUserById,
    //   updateUserById,
    //   getAllUsers,
    //   updateAuthor,
};
