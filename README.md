# Vehicle Service Booking Platform

A modern web application for booking and managing vehicle service appointments.

## Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT

## Features

- User Registration/Login with JWT Authentication
- Vehicle Management (Add/Edit/Delete)
- Service Appointment Booking
- Real-time Booking Status
- Admin Dashboard
- Responsive Design

## Setup Instructions

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
npm install
npm start
```

## Environment Variables

Create `.env` files in both frontend and backend directories:

### Backend `.env`
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend `.env`
```
REACT_APP_API_URL=http://localhost:5000
```
