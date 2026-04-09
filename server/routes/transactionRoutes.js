const express = require('express');
const {
    borrowBook,
    returnBook,
    getMyTransactions,
    getAllTransactions
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/borrow', protect, borrowBook);
router.post('/return', protect, returnBook);
router.get('/my', protect, getMyTransactions);
router.get('/', protect, admin, getAllTransactions);

module.exports = router;
