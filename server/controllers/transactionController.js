const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const User = require('../models/User');

const BORROW_DAYS = 14;
const FINE_PER_DAY = 10;
const MAX_BOOKS = 5;

// @desc    Borrow a book
// @route   POST /api/transactions/borrow
// @access  Private
const borrowBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        // 1. Find book
        const book = await Book.findById(bookId);
        if (!book) {
            res.status(404);
            return next(new Error('Book not found'));
        }

        // 2. Check availability
        if (book.availableCopies <= 0) {
            res.status(400);
            return next(new Error('No copies available for this book'));
        }

        // 3. Check user borrow limit
        const user = await User.findById(userId);
        if (user.borrowedBooks.length >= MAX_BOOKS) {
            res.status(400);
            return next(new Error(`Maximize limit reached. You can only borrow up to ${MAX_BOOKS} books.`));
        }

        // 4. Check if user already has this book issued
        const alreadyIssued = await Transaction.findOne({
            user: userId,
            book: bookId,
            status: 'issued'
        });

        if (alreadyIssued) {
            res.status(400);
            return next(new Error('You have already issued a copy of this book'));
        }

        // 5. Create Transaction
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + BORROW_DAYS);

        const transaction = await Transaction.create({
            user: userId,
            book: bookId,
            dueDate
        });

        // 6. Update Book availability
        book.availableCopies -= 1;
        await book.save();

        // 7. Update User's borrowed list
        user.borrowedBooks.push(bookId);
        await user.save();

        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};

// @desc    Return a book
// @route   POST /api/transactions/return
// @access  Private
const returnBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        // 1. Find active transaction
        const transaction = await Transaction.findOne({
            user: userId,
            book: bookId,
            status: 'issued'
        });

        if (!transaction) {
            res.status(404);
            return next(new Error('No active issue record found for this book'));
        }

        // 2. Calculate fine
        const returnDate = new Date();
        const dueDate = transaction.dueDate;
        let fine = 0;

        if (returnDate > dueDate) {
            const diffTime = Math.abs(returnDate - dueDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * FINE_PER_DAY;
        }

        // 3. Update Transaction
        transaction.status = 'returned';
        transaction.returnDate = returnDate;
        transaction.fine = fine;
        await transaction.save();

        // 4. Update Book availability
        const book = await Book.findById(bookId);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        // 5. Update User's borrowed list
        const user = await User.findById(userId);
        if (user) {
            user.borrowedBooks.pull(bookId);
            await user.save();
        }

        res.json({
            message: 'Book returned successfully',
            transaction
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user transactions
// @route   GET /api/transactions/my
// @access  Private
const getMyTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('book', 'title author coverImage')
            .sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private/Admin
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({})
            .populate('user', 'name email')
            .populate('book', 'title author')
            .sort('-createdAt');
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    borrowBook,
    returnBook,
    getMyTransactions,
    getAllTransactions
};
