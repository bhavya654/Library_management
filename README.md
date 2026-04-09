# 📚 Library Management System

A comprehensive MERN stack application for managing library inventory, book transactions, and user activity. This system features a robust Admin Dashboard for administrators and a user-friendly interface for library members.

## 🚀 Features

- **User Authentication**: Secure Login & Registration with JWT.
- **Admin Dashboard**:
  - Comprehensive oversight of all library transactions.
  - Tracking of borrowed books, due dates, and borrower details.
  - Real-time library inventory management.
- **Book Management**:
  - View available books.
  - Search and filter library assets.
  - Dynamic status tracking (Available/Borrowed).
- **Transaction History**: Track which books are borrowed by which users and when they are due.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Axios, React Router, Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT (JSON Web Tokens), bcryptjs for password hashing.
- **Deployment**: Render (Backend), Vercel (Frontend).

## 📂 Project Structure

```text
├── client/          # Frontend React application
│   ├── src/         # UI components and pages
│   └── public/      # Static assets
├── server/          # Backend Express API
│   ├── models/      # MongoDB Schemas
│   ├── controllers/ # Business logic
│   ├── routes/      # API endpoints
│   └── config/      # DB Connection
└── README.md        # Project documentation
```

## ⚙️ Installation & Setup

### 1. Prerequisite
- Node.js installed.
- MongoDB Atlas account or local MongoDB instance.

### 2. Clone the Repository
```bash
git clone https://github.com/bhavya654/Library_management.git
cd Library_management
```

### 3. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```bash
   npm start
   ```

### 4. Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend (Render)
1. Set **Root Directory** to `server`.
2. Set **Build Command** to `npm install`.
3. Set **Start Command** to `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`.

### Frontend (Vercel)
1. Set **Root Directory** to `client`.
2. Set **Framework Preset** to `Vite`.
3. Add environment variable: `VITE_API_URL` (Point it to your Render backend URL with `/api`).

## 📄 License

This project is licensed under the MIT License.
