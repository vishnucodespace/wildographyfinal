const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: { type: String, required: true }, // Name of the commenter (or user id)
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String },
  likes: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] },
  tag: { type: String, enum: ['Marine', 'Wild'], default: 'Wild' },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
