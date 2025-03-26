// services/syncBookFromSource.js

const { Book } = require("../models");

async function syncBookFromExternalSource(incomingBook, source = "unknown") {
  if (!incomingBook?.id) return;

  const updateFields = {
    title: incomingBook.name || incomingBook.title,
    price: parseFloat(incomingBook.price || 0),
    description: incomingBook.description || "No description available",
    coverImage: {
      url: incomingBook.cover || incomingBook.images?.[0]?.src || ""
    },
    updatedAt: new Date(),
    source
  };

  const updatedBook = await Book.findOneAndUpdate(
    { id: incomingBook.id },
    { $set: updateFields },
    { new: true, upsert: false } // Only update existing entries
  );

  if (updatedBook) {
    console.log(`✅ Book updated from ${source}: ${updatedBook.title}`);
  } else {
    console.warn(`⚠️ Book not found in Book model for ID: ${incomingBook.id}`);
  }
}

module.exports = { syncBookFromExternalSource };
