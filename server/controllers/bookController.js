const Book = require('../models/Book');

// @desc    Get all books (with search)
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res, next) => {
    try {
        let query = {};

        // Keyword Search
        if (req.query.keyword) {
            query.$or = [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { author: { $regex: req.query.keyword, $options: 'i' } },
            ];
        }

        // Genre Filter
        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            res.json(book);
        } else {
            res.status(404);
            return next(new Error('Book not found'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res, next) => {
    try {
        const { title, author, isbn, genre, totalCopies, description, coverImage } = req.body;

        const bookExists = await Book.findOne({ isbn });

        if (bookExists) {
            res.status(400);
            return next(new Error('Book with this ISBN already exists'));
        }

        const book = await Book.create({
            title,
            author,
            isbn,
            genre,
            totalCopies,
            availableCopies: totalCopies, // Initially all copies are available
            description,
            coverImage
        });

        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res, next) => {
    try {
        const { title, author, genre, totalCopies, description, coverImage } = req.body;

        const book = await Book.findById(req.params.id);

        if (book) {
            // Adjust available copies if total copies changed
            if (totalCopies !== undefined) {
                const diff = totalCopies - book.totalCopies;
                book.availableCopies += diff;
                book.totalCopies = totalCopies;
            }

            book.title = title || book.title;
            book.author = author || book.author;
            book.genre = genre || book.genre;
            book.description = description || book.description;
            book.coverImage = coverImage || book.coverImage;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } else {
            res.status(404);
            return next(new Error('Book not found'));
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (book) {
            await Book.deleteOne({ _id: book._id });
            res.json({ message: 'Book removed' });
        } else {
            res.status(404);
            return next(new Error('Book not found'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
