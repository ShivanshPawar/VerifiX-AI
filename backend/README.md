# DeepFake Detection Backend

A Node.js backend for the DeepFake Detection application. This API provides user authentication with JWT-based security and deepfake detection using Reality Defender SDK. Users can register, login, and scan images for AI-generated or manipulated content.

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
- **AI Detection:** Reality Defender SDK (@realitydefender/realitydefender 0.1.16)
- **Environment Management:** dotenv
- **HTTP Client:** Axios
- **Additional Tools:** 
  - CORS support
  - Multer for file uploads
  - UUID for unique identifiers
  - MIME types support
  - Form-data for multipart uploads

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
│   │   ├── env.js                # Environment variables management
│   │   └── realityDefender.config.js  # Reality Defender SDK configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication business logic
│   │   └── scan.controller.js    # Image scan and detection logic
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT authentication middleware
│   │   └── upload.middleware.js  # File upload configuration (Multer)
│   ├── models/
│   │   ├── user.model.js         # User MongoDB schema
│   │   └── scan.model.js         # Scan result MongoDB schema
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication API routes
│   │   └── scan.routes.js        # Image scan API routes
│   ├── services/
│   │   └── realityDefender.service.js  # Reality Defender SDK service wrapper
│   └── utils/
│       └── hash.util.js          # Image hash generation utility
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
- @realitydefender/realitydefender (Reality Defender SDK)
- form-data

### Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/deepfake_detection
JWT_SECRET=your_super_secret_jwt_key_here
REALITY_DEFENDER_API_KEY=your_reality_defender_api_key_here
REALITY_DEFENDER_BASE_URL=https://api.realitydefender.ai  # Optional, defaults to official API
```

**Environment Variables Explanation:**
| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3000 | No |
| `MONGO_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | - | Yes |
| `REALITY_DEFENDER_API_KEY` | API key for Reality Defender service | - | Yes |
| `REALITY_DEFENDER_BASE_URL` | Custom base URL for Reality Defender API | Official API | No |

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

### Authentication Base URL
```
http://localhost:3000/api/v1/auth
```

### Scan Base URL
```
http://localhost:3000/api/v1/scan
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

### 3. Scan Image for Deepfake Detection

**Endpoint:** `POST /api/v1/scan/image`

**Authentication:** Required (JWT token in cookie)

**Request:** Multipart form data
- `image`: Image file (jpg, jpeg, png, gif, webp)
- Max file size: 10 MB

**Success Response (200):**
```json
{
  "message": "Scan completed",
  "scanId": "507f1f77bcf86cd799439011",
  "status": "COMPLETED",
  "verdict": "AUTHENTIC",
  "score": 0.95
}
```

**Possible Verdicts:**
- `AUTHENTIC` - Image appears to be genuine
- `MANIPULATED` - Image has been manipulated or is AI-generated
- `SUSPICIOUS` - Image shows signs of manipulation but uncertain

**Error Response (400):**
```json
{
  "message": "Image is required"
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized"
}
```

**Error Response (500):**
```json
{
  "message": "Scan failed",
  "error": "Error message details"
}
```

**Description:**
- Requires authentication via JWT token
- Accepts image files up to 10 MB
- Generates hash of the image for duplicate detection
- Uses Reality Defender SDK to analyze the image
- Stores scan results in database with status, verdict, and score
- Returns detection results synchronously

**Supported Image Formats:**
- JPEG/JPG
- PNG
- GIF
- WebP

---

## 🔐 Features

### 1. **Secure Authentication**
   - Password hashing using bcrypt with salt iteration count of 10
   - JWT token-based session management
   - HTTP-only cookies for token storage
   - Protected routes with authentication middleware

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

### 4. **Deepfake Detection (Image Scanning)**
   - AI-powered image analysis using Reality Defender SDK
   - Support for multiple image formats (JPEG, PNG, GIF, WebP)
   - File size validation (max 10 MB)
   - Image hash generation for duplicate detection
   - Synchronous detection with immediate results
   - Score-based confidence rating (0-1 scale)
   - Verdict classification (AUTHENTIC, MANIPULATED, SUSPICIOUS)
   - Scan history tracking in database

### 5. **Database Management**
   - MongoDB integration using Mongoose
   - Automatic connection pooling
   - Schema validation for data integrity
   - Timestamps on user and scan documents
   - User-scan relationship tracking

### 6. **File Upload Handling**
   - Multer middleware for multipart form data
   - Memory storage for efficient processing
   - MIME type validation
   - Temporary file management for SDK compatibility

### 7. **Error Handling**
   - Comprehensive error messages for client feedback
   - Proper HTTP status codes (201, 200, 400, 401, 500)
   - Database connection error handling
   - API service error handling

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
- Environment variable validation

### `/src/config/realityDefender.config.js`
- Reality Defender SDK client initialization
- API key validation
- Client instance export for service layer

### `/src/controllers/auth.controller.js`
- **register()** - Handles user registration logic
  - Checks for existing users
  - Hashes passwords
  - Creates user in database
  - Generates JWT token
  
- **login()** - Handles user authentication logic
  - Validates user existence
  - Compares passwords
  - Generates JWT token with expiration

### `/src/controllers/scan.controller.js`
- **createScan()** - Handles image scanning logic
  - Validates file upload
  - Generates image hash
  - Creates scan record in database
  - Calls Reality Defender service
  - Updates scan with results
  - Returns detection verdict and score

### `/src/middleware/auth.middleware.js`
- JWT token verification
- User authentication check
- Extracts user information from token
- Protects routes requiring authentication

### `/src/middleware/upload.middleware.js`
- Multer configuration for file uploads
- Memory storage for efficient processing
- File size limits (10 MB)
- MIME type validation for images

### `/src/models/user.model.js`
- User schema definition with fields:
  - `email` - Unique, required, lowercase
  - `fullName` - Object with firstName and lastName
  - `password` - Required, hashed
  - `timestamps` - Automatic createdAt and updatedAt

### `/src/models/scan.model.js`
- Scan schema definition with fields:
  - `user` - Reference to User model
  - `filename` - Original filename
  - `imageHash` - Hash of image for duplicate detection
  - `status` - PENDING, COMPLETED, or FAILED
  - `verdict` - AUTHENTIC, MANIPULATED, or SUSPICIOUS
  - `score` - Confidence score (0-1)
  - `aiRawResponse` - Raw response from Reality Defender
  - `timestamps` - Automatic createdAt and updatedAt

### `/src/routes/auth.routes.js`
- Route definitions for authentication endpoints:
  - POST `/register` - User registration
  - POST `/login` - User authentication

### `/src/routes/scan.routes.js`
- Route definitions for scan endpoints:
  - POST `/image` - Scan image for deepfake detection (requires auth)

### `/src/services/realityDefender.service.js`
- **analyzeImage()** - Wrapper for Reality Defender SDK
  - Converts buffer to temporary file
  - Calls SDK `detect()` method
  - Maps SDK response to application format
  - Handles temporary file cleanup
  - Error handling and logging

### `/src/utils/hash.util.js`
- Image hash generation utility
- Used for duplicate detection

---

## 🔄 Application Flow

### Authentication Flow

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

### Image Scanning Flow

```
Image Scan:
1. User uploads image file (with JWT authentication)
2. Middleware validates file type and size
3. Image hash is generated for duplicate detection
4. Scan record is created in database (status: PENDING)
5. Image buffer is converted to temporary file
6. Reality Defender SDK analyzes the image
7. SDK returns detection result (status, score)
8. Scan record is updated with results (status: COMPLETED)
9. Temporary file is cleaned up
10. Detection verdict and score are returned to user
```

---

## 🛡️ Security Best Practices Implemented

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for token storage
- ✅ Email uniqueness validation
- ✅ Protected API routes with authentication middleware
- ✅ File upload validation (type and size)
- ✅ Database connection error handling
- ✅ Environment variable protection (.env not committed)
- ✅ Proper HTTP status codes
- ✅ Password comparison timing attack protection (bcrypt)
- ✅ Secure temporary file handling
- ✅ API key protection for external services

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
| `REALITY_DEFENDER_API_KEY missing` | Ensure `REALITY_DEFENDER_API_KEY` is set in `.env` file |
| `User already exists` | Register with a different email address |
| `Invalid email or password` | Verify credentials match registered account |
| `Unauthorized` | Ensure JWT token is present in cookies for protected routes |
| `Image is required` | Ensure image file is included in multipart form data |
| `Invalid file type` | Use supported formats: JPEG, PNG, GIF, WebP |
| `File too large` | Ensure image is under 10 MB |
| `Scan failed` | Check Reality Defender API key and network connectivity |
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
- [Reality Defender SDK Documentation](https://docs.realitydefender.com/sdks/quickstart)
- [Multer Documentation](https://github.com/expressjs/multer)

---

## 📝 Notes on Reality Defender Integration

The Reality Defender SDK requires file paths rather than buffers. The service layer handles this by:
1. Creating temporary files from uploaded buffers
2. Passing file paths to the SDK
3. Cleaning up temporary files after analysis

The SDK's `detect()` method handles both file upload and analysis in a single call, making it efficient for synchronous operations.

**Getting a Reality Defender API Key:**
1. Sign up at [Reality Defender Platform](https://app.realitydefender.ai)
2. Navigate to Settings → API Keys
3. Generate a new API key
4. Add it to your `.env` file as `REALITY_DEFENDER_API_KEY`

---

**Last Updated:** February 9, 2026
