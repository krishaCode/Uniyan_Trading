# TradNex — Trading Course Management Platform

A full-stack MERN application for managing a professional trading education platform.

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install
```bash
npm run install-all
```

### 2. Configure Environment
Edit `server/.env` with your MongoDB URI and JWT secret.

### 3. Seed Database (creates admin account)
```bash
npm run seed
```

### 4. Run Development
```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Default Admin Credentials
- Email: `admin@tradenex.com`
- Password: `Admin@123`

## Features
- Student registration with admin approval workflow
- Video access control per user
- YouTube video embedding
- News & updates management
- Contact message system
- Dark / Light theme
- Fully responsive design
