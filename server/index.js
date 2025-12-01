require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Models
const Caption = require('./models/Caption');
const User = require('./models/Users'); // Make sure your file is named Users.js or User.js
const Favorite = require('./models/Favorite');

// Utils
const { getRandomGradient } = require('./utils');

const app = express();

// --- Middleware ---
app.use(cors());
// Increase limit for Base64 images
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. SIGN UP
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // A. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // B. Check if user exists (Crucial Step)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // C. Generate Avatar & Create User
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    
    // Note: In a production app, you should hash the password here (e.g., using bcrypt)
    const newUser = new User({ name, email, password, avatar });
    await newUser.save();

    console.log('✅ User created:', { name, email, id: newUser._id });

    // D. Return User (Exclude password)
    const userResponse = { ...newUser.toObject() };
    delete userResponse.password;
    
    res.status(201).json(userResponse);

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message || 'Server error during signup' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Simple password check (Prototype only)
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: List all users (For debugging only)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// CAPTION ROUTES
// ==========================================

// GET: Fetch Captions (With Language Filter)
app.get('/api/captions', async (req, res) => {
  try {
    const { lang } = req.query; 
    const filter = lang ? { language: lang } : { language: 'english' };
    
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
      image: image || null,
      gradient: getRandomGradient()
    });

    const savedCaption = await newCaption.save();
    console.log('✅ Caption posted:', { id: savedCaption._id, hasImage: !!image });
    res.status(201).json(savedCaption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ==========================================
// FAVORITE ROUTES
// ==========================================

// POST: Toggle Favorite
app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, captionId } = req.body;
    
    if (!userId || !captionId) return res.status(400).json({ error: 'Missing Data' });

    const existing = await Favorite.findOne({ userId, captionId });
    
    if (existing) {
      await Favorite.deleteOne({ userId, captionId });
      res.json({ favorited: false, message: 'Removed from favorites' });
    } else {
      const newFavorite = new Favorite({ userId, captionId });
      await newFavorite.save();
      res.json({ favorited: true, message: 'Added to favorites' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Get User's Favorites (Optimized)
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Populate the caption details directly
    const favorites = await Favorite.find({ userId })
      .populate({
        path: 'captionId',
        options: { sort: { createdAt: -1 } } // Sort captions by newest
      });
    
    // Extract just the caption objects, removing any nulls (deleted captions)
    const captions = favorites
      .map(fav => fav.captionId)
      .filter(caption => caption !== null);
    
    res.json(captions);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Check specific favorites status
app.get('/api/favorites/check/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { captionIds } = req.query; 
    
    if (!captionIds) return res.json({});
    
    const ids = captionIds.split(',');
    const favorites = await Favorite.find({ userId, captionId: { $in: ids } });
    
    const favoritedMap = {};
    favorites.forEach(fav => {
      favoritedMap[fav.captionId.toString()] = true;
    });
    
    res.json(favoritedMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));