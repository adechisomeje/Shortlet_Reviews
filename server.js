const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your frontend
  credentials: true, // Enable cookies if necessary
}));

// Configure express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a secure secret key
    resave: false, // Don't save the session if it wasn't modified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Use secure cookies in production
  })
);

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Import Passport configuration
require('./config/passport');

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to ShortletReview API');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/reviews', reviewRoutes);

// Connect to MongoDB and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});