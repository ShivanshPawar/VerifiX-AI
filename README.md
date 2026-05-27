# VerifiX

AI-Powered Deepfake Image Detection Platform

VerifiX is a full-stack AI-powered web application designed to analyze and detect manipulated or AI-generated images using advanced image analysis workflows. The platform provides secure authentication, real-time image scanning, scan history tracking, dashboard analytics, and AI-generated verification reports through a modern and responsive user interface.

---

## ✨ Features

- AI-powered deepfake image analysis
- Secure JWT authentication system
- Guest image scanning functionality
- Responsive modern UI
- Scan history management
- Dashboard analytics
- Protected routes and middleware validation
- SHA-256 image hashing
- Analysis caching mechanism
- Thumbnail generation for scan previews
- REST API architecture
- AI-generated image authenticity reports

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Sharp

### AI & External Services
- Reality Defender
- Gemini AI

---

## 📁 Project Structure

```bash
VerifiX/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── routes/
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/ShivanshPawar/DeepFake-Detection.git
cd verifix
```

---

## ⚙️ Backend Setup

### Navigate to backend

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Create `.env` file

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_ORIGINS=http://localhost:5173,http://localhost:5174
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false

REALITY_DEFENDER_API_KEY=your_api_key

GEMINI_API_KEY=your_api_key
```

### Start backend server

```bash
npm run dev
```

---

## 🎨 Frontend Setup

### Navigate to frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Create `.env` file

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

For separate production deployments such as Render/Vercel/Netlify, set:

```env
FRONTEND_ORIGINS=https://your-frontend-domain
COOKIE_SAME_SITE=none
COOKIE_SECURE=true
VITE_API_BASE_URL=https://your-backend-domain/api/v1
```

### Start frontend server

```bash
npm run dev
```

---

## 🔐 Authentication System

The platform includes:

- User Registration
- User Login
- JWT-based Authentication
- HTTP-only Cookie Sessions
- Protected Routes
- Session Restoration
- Logout Functionality

---

## 🧠 AI Detection Workflow

1. User uploads an image
2. SHA-256 hash is generated
3. Existing analysis cache is checked
4. Image is processed through AI analysis services
5. Confidence score and verdict are generated
6. Analysis result is stored in database
7. Report is returned to frontend

---

## 📊 Core Pages

| Page | Description |
|------|-------------|
| Landing | Application home page |
| SignIn | User authentication |
| SignUp | User registration |
| Dashboard | User analytics dashboard |
| Scan | Image analysis interface |
| History | Previous scan records |
| HistoryDetail | Detailed analysis results |

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected backend APIs
- Protected frontend routes
- HTTP-only secure cookies
- CORS configuration
- File type validation
- File size restrictions
- Environment variable protection

---

## 📦 API Routes

### Authentication

```bash
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Scan Routes

```bash
POST /scan/image
POST /guest/image
```

### History Routes

```bash
GET    /history
GET    /history/:id
DELETE /history/:id
```

### Dashboard Routes

```bash
GET /dashboard
```

---

## 🖼️ Supported Image Formats

- JPG
- JPEG
- PNG
- WEBP
- GIF

Maximum upload size: **10 MB**

---

## 👨‍💻 Developers

- Shivansh Pawar

---

## 📄 License

Licensed under the MIT License.

---

## ⭐ Highlights

- Full-stack MERN architecture
- AI-powered analysis workflow
- Modular scalable codebase
- Responsive modern interface
- Secure authentication system
- Optimized image processing pipeline
- Database-driven analysis management
