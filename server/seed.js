const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Transaction = require('./models/Transaction');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Data Cleared...');

    // Create Admin User
    const admin = await User.create({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    console.log('Admin User Created');

    // Create Regular Student
    await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'user'
    });
    console.log('Student User Created');

    // Create Test Books
    await Book.create([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        genre: 'Classic',
        totalCopies: 5,
        availableCopies: 5,
        description: 'A classic novel about the American Dream.'
      },
      {
        title: 'Node.js Design Patterns',
        author: 'Mario Casciaro',
        isbn: '9781785885587',
        genre: 'Technical',
        totalCopies: 2,
        availableCopies: 2,
        description: 'Advanced patterns for Node.js developers.'
      }
    ]);
    console.log('Test Books Created');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
