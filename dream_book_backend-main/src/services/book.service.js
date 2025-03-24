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
    // FIX HERE NEW: Handle status filtering.
    if (query.status) {
        // query.status = query.status.trim();
        console.log("Filtering by status:", query.status); // Debug log (Message 45)
        query.status = query.status.trim().toLowerCase();
        // if(query.status === "All") { // If status is "All", remove the filter.
        //     delete query.status;
        // }
        if (query.status === "all") {
            delete query.status;
        } else if (!["approved", "pending", "rejected", "sold", "available"].includes(query.status)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status value");
        }
    }

     // If you also handle status, it might look like:
  // if (query.status === "All") { delete query.status; }

  // FIX HERE NEW: Build the sort object based on the sortParam
//   let sort = {};
//   if (sortParam === 'oldToNew') {          // If user wants oldest first
//     sort = { createdAt: 1 };              // Ascending by createdAt
//   } else if (sortParam === 'newToOld') {   // If user wants newest first
//     sort = { createdAt: -1 };             // Descending by createdAt
//   }

let sort = { createdAt: -1 }; // Default to newest first
    // if (query.sort === "oldToNew") {
    //     sort = { createdAt: 1 };
    // }
    if (query.sort) {
        switch (query.sort) {
            case "oldToNew":
                sort = { createdAt: 1 };
                break;
            case "titleAsc":
                sort = { title: 1 };
                break;
            case "titleDesc":
                sort = { title: -1 };
                break;
        }
    }
    // try {
    //     // Fetch books from database
    //     let books = await getAllData(Book, query, populateConfig, sort);
    //     console.log("Books fetched from database:", books.length, "books found"); // Debug log (Message 45)


    //     console.log("Raw data retrieved from DB:", books); // Debug log
    //     console.log("HELLO, Type of books:", typeof books); // Check type
    //     console.log("HELLO, Is books an array?", Array.isArray(books)); // Check if array

    //     // Ensure books is always an array
    //     if (!Array.isArray(books)) {
    //         books = []; // Default to an empty array if not an array
    //     }
    //     console.log("HELLO, Final books array length:", books.length); // Debugging
    //     return {
    //         status: true,
    //         message: books.length ? "All books retrieved" : "No books found",
    //         data: books
    //     };
    // } 
    try {
        // ✅ FIX: Ensure getAllData returns an array, extract `results`
        let books = await getAllData(Book, query, populateConfig, sort);
        
        console.log("Books fetched from database:", books); // Debug log

        // ✅ FIX: Extract array correctly
        let booksArray = books?.results || [];

        console.log("Final books array length:", booksArray.length); // Debugging

        return booksArray; // ✅ Return only the array
    }catch (error) {
        console.error("Error fetching books:", error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching books");
    }
    // const data = await getAllData(Book, query, populateConfig);
    // return data;
}

// FIX HERE NEW: New service function to update only the book's status.
async function updateBookStatus(id, newStatus) {
    const book = await Book.findById(id);
    if (!book) {
        throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
    }
    // Validate newStatus if needed
    if (!["approved", "pending", "rejected"].includes(newStatus)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status value");
    }
    book.status = newStatus;
    await book.save();
    return book;
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
