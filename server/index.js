require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Caption = require('./models/Caption');
const { getRandomGradient } = require('./utils');
const User = require('./models/Users'); // Import the new User model
const Favorite = require('./models/Favorite'); // Import Favorite model

const app = express();
app.use(cors());
// app.use(express.json());
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Allow large image uploads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }
  
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already exists" });
  
      // Create new user
      // Generate a random avatar based on name
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      
      const newUser = new User({ name, email, password, avatar });
      await newUser.save();

      console.log('✅ User saved to MongoDB:', { name, email, id: newUser._id });

      // Don't send password back
      const userResponse = { ...newUser.toObject() };
      delete userResponse.password;
      
      res.status(201).json(userResponse);
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: err.message || 'Server error during signup' });
    }
  });
  
  // GET: List all users (for testing/debugging)
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({}).select('-password'); // Exclude passwords
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. LOGIN
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Check password (simple check for prototype)
      if (user.password !== password) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Don't send password back
      const userResponse = { ...user.toObject() };
      delete userResponse.password;
      
      res.json(userResponse);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: err.message || 'Server error during login' });
    }
  });
  
// GET: Fetch Captions (With Language Filter)
app.get('/api/captions', async (req, res) => {
  try {
    const { lang } = req.query; // e.g. ?lang=english
    const filter = lang ? { language: lang } : { language: 'english' }; // Default to English
    
    const captions = await Caption.find(filter).sort({ createdAt: -1 });
    res.json(captions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add New Caption
app.post('/api/captions', async (req, res) => {
  try {
    const { text, language, category, image } = req.body;
    
    const newCaption = new Caption({
      text,
      language,
      category,
      image: image || null, // Include image if provided
      gradient: getRandomGradient() // Auto-assign a gradient
    });

    const savedCaption = await newCaption.save();
    console.log('✅ Caption saved:', { id: savedCaption._id, hasImage: !!savedCaption.image });
    res.status(201).json(savedCaption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Toggle Favorite (Add/Remove)
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, captionId } = req.body;
    
    if (!userId || !captionId) {
      return res.status(400).json({ error: 'userId and captionId are required' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId, captionId });
    
    if (existing) {
      // Remove favorite
      await Favorite.deleteOne({ userId, captionId });
      res.json({ favorited: false, message: 'Removed from favorites' });
    } else {
      // Add favorite
      const newFavorite = new Favorite({ userId, captionId });
      await newFavorite.save();
      res.json({ favorited: true, message: 'Added to favorites' });
    }
  } catch (err) {
    console.error('Favorite error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Get User's Favorites
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const favorites = await Favorite.find({ userId }).populate('captionId');
    
    // Filter out any null captionIds (in case caption was deleted)
    const validFavorites = favorites.filter(fav => fav.captionId);
    const captionIds = validFavorites.map(fav => fav.captionId._id);
    
    // Get full caption data
    const captions = await Caption.find({ _id: { $in: captionIds } }).sort({ createdAt: -1 });
    
    res.json(captions);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Check if captions are favorited by user
app.get('/api/favorites/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { captionIds } = req.query; // Comma-separated caption IDs
    
    if (!captionIds) {
      return res.json({});
    }
    
    const ids = captionIds.split(',');
    const favorites = await Favorite.find({ 
      userId, 
      captionId: { $in: ids } 
    });
    
    const favoritedMap = {};
    favorites.forEach(fav => {
      favoritedMap[fav.captionId.toString()] = true;
    });
    
    res.json(favoritedMap);
  } catch (err) {
    console.error('Check favorites error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));