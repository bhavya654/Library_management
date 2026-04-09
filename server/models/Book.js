const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'Please add an ISBN'],
        unique: true,
        trim: true
    },
    genre: {
        type: String,
        required: [true, 'Please add a genre']
    },
    totalCopies: {
        type: Number,
        required: [true, 'Please add total copies'],
        min: 0
    },
    availableCopies: {
        type: Number,
        required: [true, 'Please add available copies'],
        min: 0
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    coverImage: {
        type: String,
        default: 'no-photo.jpg'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
