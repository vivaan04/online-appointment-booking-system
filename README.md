# Online Appointment System

This is a simple online appointment booking system built with MERN stack (MongoDB, Express, Node.js) but using HTML/CSS/JavaScript for the frontend instead of React.

## Features

- User registration and login
- Book appointments with available time slots
- View personal appointments
- Admin view of all appointments
- Modern, responsive UI

## Setup Instructions

### 1. Install MongoDB
Since MongoDB wasn't installed automatically, please install it manually:

**For Windows:**
- Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Run the installer and follow the setup wizard
- Start MongoDB service (mongod.exe) or add it to Windows services

**Alternative: Use MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/atlas
- Create a free cluster
- Get connection string and update `server.js`:
  ```javascript
  mongoose.connect('your_mongodb_atlas_connection_string', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  ```

### 2. Install Dependencies
- Navigate to the `backend` folder
- Run `npm install`

### 3. Start the Backend
- In the `backend` folder, run `npm start`
- Server will start on http://localhost:5000

### 4. Open Frontend
- Open `frontend/index.html` in your browser
- Or access http://localhost:5000 (since backend serves frontend files)

## Usage

1. **Register**: Create a new account
2. **Login**: Log in with your credentials
3. **Book Appointment**: Select a date, load available slots, choose a time, and book
4. **View Appointments**: See your booked appointments

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/appointments` - Book a new appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/slots?date=YYYY-MM-DD` - Get available slots for a date

## Troubleshooting

- If MongoDB connection fails, check if MongoDB is running
- Ensure Node.js is installed (version 14+ recommended)
- Check console for any errors