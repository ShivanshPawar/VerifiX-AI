# DeepFake Detection Backend

A Node.js authentication backend for the DeepFake Detection application. This API provides user registration and login functionality with JWT-based authentication and password security using bcrypt.

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Server](#-running-the-server)
- [API Endpoints](#-api-endpoints)
- [Features](#-features)
- [Directory Overview](#-directory-overview)

---

## 🛠 Technology Stack

- **Framework:** Express.js 5.2.1
- **Database:** MongoDB (Mongoose 9.1.6)
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Bcrypt (Password hashing)
- **Environment Management:** dotenv
- **HTTP Client:** Axios
- **Additional Tools:** 
  - CORS support
  - Multer for file uploads
  - UUID for unique identifiers
  - MIME types support

---

## 📁 Project Structure

```
backend/
├── .env                          # Environment variables (not committed)
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies and project metadata
├── server.js                     # Main server entry point
├── src/
│   ├── app.js                    # Express app setup and middleware
│   ├── config/
│   │   ├── db.js                 # MongoDB connection configuration
│   │   └── env.js                # Environment variables management
│   ├── controllers/
│   │   └── auth.controller.js    # Authentication business logic
│   ├── models/
│   │   └── user.model.js         # User MongoDB schema
│   └── routes/
│       └── auth.routes.js        # Authentication API routes
└── README.md                     # This file
```

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB instance (local or cloud-based)

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

This installs all required dependencies listed in `package.json`:
- express
- mongoose
- bcrypt
- jsonwebtoken
- cors
- dotenv
- axios
- multer
- uuid
- mime-types

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/deepfake_detection
JWT_SECRET=your_super_secret_jwt_key_here
```

**Environment Variables Explanation:**
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | 3000 |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT token signing | Required |

---

## 🚀 Running the Server

Start the server with:

```bash
npm start
```

or if you have configured a start script, use:

```bash
node server.js
```

**Expected Output:**
```
MongoDB connected successfully
Server running on port 3000
```

The API will be accessible at `http://localhost:3000`

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1/auth
```

### 1. User Registration

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "user register successfully",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

**Description:**
- Creates a new user account in the database
- Passwords are hashed using bcrypt with 10 salt rounds for security
- Generates a JWT token and sets it in an HTTP-only cookie
- Validates that the email is unique

---

### 2. User Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "User Logged in Successfully",
  "user": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

**Description:**
- Authenticates user credentials against stored hashed passwords
- Generates JWT token with 24-hour expiration
- Sets token in HTTP-only cookie for secure client-side storage
- Returns user information upon successful authentication

---

## 🔐 Features

### 1. **Secure Authentication**
   - Password hashing using bcrypt with salt iteration count of 10
   - JWT token-based session management
   - HTTP-only cookies for token storage

### 2. **User Registration**
   - Email validation and uniqueness check
   - Structured full name storage (first name and last name)
   - Automatic password hashing before storage
   - Timestamps for user creation and updates

### 3. **User Login**
   - Email and password verification
   - Secure password comparison using bcrypt
   - JWT token generation with 24-hour expiration
   - User data retrieval without returning sensitive information

### 4. **Database Management**
   - MongoDB integration using Mongoose
   - Automatic connection pooling
   - Schema validation for data integrity
   - Timestamps on user documents

### 5. **Error Handling**
   - Comprehensive error messages for client feedback
   - Proper HTTP status codes (201, 200, 400, 401)
   - Database connection error handling

---

## 📂 Directory Overview

### `/src/app.js`
- Express application initialization
- Middleware configuration (JSON parsing)
- Route mounting for authentication
- Sample health check route at `/`

### `/src/config/db.js`
- MongoDB connection setup
- Connection error handling
- Uses Mongoose for database operations

### `/src/config/env.js`
- Centralized environment variable management
- Default port fallback to 3000
- Configuration exports for other modules

### `/src/Controllers/auth.controller.js`
- **register()** - Handles user registration logic
  - Checks for existing users
  - Hashes passwords
  - Creates user in database
  - Generates JWT token
  
- **login()** - Handles user authentication logic
  - Validates user existence
  - Compares passwords
  - Generates JWT token with expiration
  
### `/src/models/user.model.js`
- User schema definition with fields:
  - `email` - Unique, required, lowercase
  - `fullName` - Object with firstName and lastName
  - `password` - Required, hashed
  - `timestamps` - Automatic createdAt and updatedAt

### `/src/routes/auth.routes.js`
- Route definitions for authentication endpoints:
  - POST `/register` - User registration
  - POST `/login` - User authentication

---

## 🔄 Authentication Flow

```
User Registration:
1. User submits email, fullName, and password
2. System checks if email already exists
3. Password is hashed using bcrypt
4. User document is created in MongoDB
5. JWT token is generated
6. Token is set in HTTP-only cookie
7. User data is returned in response

User Login:
1. User submits email and password
2. User is found by email in database
3. Password is compared with stored hash
4. JWT token is generated with 24-hour expiration
5. Token is set in HTTP-only cookie
6. User data is returned in response
```

---

## 🛡️ Security Best Practices Implemented

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ Email uniqueness validation
- ✅ Database connection error handling
- ✅ Environment variable protection (.env not committed)
- ✅ Proper HTTP status codes
- ✅ Password comparison timing attack protection (bcrypt)

---

## 📝 Development Notes

### Adding New Features

To add new authentication features:

1. **Create Model** - Define schema in `/src/models/`
2. **Create Controller** - Add business logic in `/src/controllers/`
3. **Create Routes** - Define API endpoints in `/src/routes/`
4. **Mount Routes** - Register routes in `/src/app.js`

### Database Models

All models use Mongoose for schema validation and database operations. Ensure timestamps are enabled for audit trails.

### Error Handling

- Always return appropriate HTTP status codes
- Provide meaningful error messages
- Log errors to console for debugging

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongoDB connection failed` | Check `MONGO_URI` in `.env` and ensure MongoDB is running |
| `JWT_SECRET undefined` | Ensure `JWT_SECRET` is set in `.env` file |
| `User already exists` | Register with a different email address |
| `Invalid email or password` | Verify credentials match registered account |
| `Cannot find module` | Run `npm install` to install dependencies |

---

## 📄 License

ISC

---

## 👨‍💻 Author

Created for the DeepFake Detection Project

---

## 🔗 Related Documentation

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)

---

**Last Updated:** February 6, 2026
