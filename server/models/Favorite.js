const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  captionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Caption', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Ensure one user can only favorite a caption once
FavoriteSchema.index({ userId: 1, captionId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);

