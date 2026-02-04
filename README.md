# 💬 Real-Time Chat Application

A full-stack, real-time group chat application built with **React**, **Node.js**, **WebSockets**, and **Redis**. Features secure user authentication, room-based messaging, and a scalable Pub/Sub architecture.

---

## 🚀 Tech Stack

### Frontend

- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Language:** TypeScript
- **Real-time:** WebSocket (Custom Hook)

### Backend

- **Runtime:** Node.js + TypeScript
- **WebSockets:** `ws` library
- **Database:** PostgreSQL (user data)
- **Pub/Sub & Cache:** Redis
- **Authentication:** JWT + Bcrypt password hashing

### Infrastructure

- **Containerization:** Docker Compose (PostgreSQL, Redis)

---

## 📂 Project Structure

```
ws-chatapp/
├── backend/
│   ├── src/
│   │   ├── index.ts       # HTTP server & auth routes (/login, /register)
│   │   ├── ws.ts          # WebSocket server & message handling
│   │   ├── db.ts          # PostgreSQL connection pool
│   │   ├── redis.ts       # Redis Pub/Sub channels
│   │   └── types.d.ts     # Global type definitions
│   ├── package.json
│   ├── tsconfig.json
│   └── .env               # [Create this file]
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx       # React entry point
│   │   ├── App.tsx        # Router setup
│   │   ├── Landing.tsx    # Welcome/room selection
│   │   ├── Login.tsx      # Login form
│   │   ├── SignUp.tsx     # Registration form
│   │   ├── Chat.tsx       # Chat interface
│   │   ├── hooks/
│   │   │   └── useSocket.ts   # Custom WebSocket hook
│   │   ├── utils/
│   │   │   └── random-code.ts # Room code generator
│   │   ├── assets/
│   │   └── index.css
│   ├── vite.config.ts
│   └── package.json
│
└── docker-compose.yml     # PostgreSQL + Redis services
```

---

## 🛠️ Quick Start

### Prerequisites

- **Node.js** v18+
- **Docker** & **Docker Compose**
- **Git**

### Step 1️⃣ Clone & Install Dependencies

```bash
git clone <repo-url>
cd ws-chatapp

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### Step 2️⃣ Start Services

```bash
docker-compose up -d
```

This starts:

- **PostgreSQL** on `localhost:5432` (user: `myuser`, password: `random`, db: `local_pg`)
- **Redis** on `localhost:6379`

### Step 3️⃣ Setup Backend

Create `backend/.env`:

```env
PORT=5000
SECRET=your_super_secret_jwt_key_here_min_32_chars
```

Create the database table. Run this **once** in your DB:

```sql
CREATE TABLE users(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hashed VARCHAR(255) NOT NULL
);
```

Or use your DB client (DBeaver, pgAdmin, etc.) to run it.

Start the backend:

```bash
cd backend && npm run dev
```

### Step 4️⃣ Start Frontend

```bash
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

| Feature                    | Description                             |
| -------------------------- | --------------------------------------- |
| 🔐 **Authentication**      | Secure signup & login with JWT + Bcrypt |
| 🛏️ **Room Management**     | Create or join rooms with unique codes  |
| 💬 **Real-time Messaging** | Instant WebSocket-powered chat          |
| 👥 **User Presence**       | See who's typing (extensible)           |
| 📡 **Scalable Pub/Sub**    | Redis channels allow multiple backends  |
| 🎨 **Modern UI**           | Tailwind CSS with responsive design     |

---

## 🔌 API Reference

### HTTP Endpoints

#### `POST /register`

Register a new user.

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword123"
}
```

**Response:** `{ "token": "eyJhbGc..." }`

#### `POST /login`

Authenticate an existing user.

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `{ "token": "eyJhbGc..." }`

### WebSocket Messages

#### Client → Server

**Join Room**

```json
{ "type": "join", "roomId": "room123" }
```

**Send Message**

```json
{ "type": "chat", "message": "Hello everyone!" }
```

**Leave Room**

```json
{ "type": "exit" }
```

#### Server → Client

**Incoming Message**

```json
{
  "roomId": "room123",
  "message": "Hello everyone!",
  "sender": {
    "userId": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

---

## 🔒 Security Notes

⚠️ **Current Implementation is NOT Production-Ready**

Known issues to address before deployment:

- JWT tokens currently lack expiration (`exp` claim)
- Room access is not restricted per user
- No input validation on chat messages
- Token passed in WebSocket URL query param (exposed in logs)
- CORS allows all origins (`*`)
- No rate limiting on login/messages
- HTTP only (use HTTPS + WSS in production)

See [SECURITY.md](SECURITY.md) for recommended hardening steps.

---

## 📦 Available Scripts

### Backend

```bash
npm run dev      # Start dev server with auto-reload
npm run build    # Compile TypeScript
npm start        # Run compiled JS
```

### Frontend

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview build locally
npm run lint     # ESLint checks
```

---

## 🚀 Deployment

### Using Docker

```bash
docker-compose up --build
```

### Environment Variables (Production)

- `PORT` → Server port
- `SECRET` → Strong JWT secret (minimum 32 chars)
- Database credentials in `backend/src/db.ts`
- Redis URL in `backend/src/redis.ts`

---

## 📝 License

ISC