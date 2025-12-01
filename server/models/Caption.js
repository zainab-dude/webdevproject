const mongoose = require('mongoose');

const CaptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  language: { type: String, enum: ['english', 'urdu', 'roman'], default: 'english' },
  category: { type: String, default: 'General' },
  likes: { type: Number, default: 0 },
  gradient: { type: String, required: true },
  
  // NEW FIELD: Stores the Base64 string of the generated image
  image: { type: String, default: null }, 

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Caption', CaptionSchema);