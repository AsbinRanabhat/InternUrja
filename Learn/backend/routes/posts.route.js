const express = require('express');
const router  = express.Router();
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const Post = require('../models/Post');

router.get('/', asyncHandler(async (req, res, next) => {
  const filter = {};
  if (req.query.author)  filter.author = req.query.author;
  if (req.query.tags) filter.tags = { $in: req.query.tags.split(',') };
  const posts = (await Post.find(filter)).sort({ createdAt: -1 });

  res.json({ success: true, count: posts.length, data: posts });
}));

// GET /posts/:id
router.get('/:id',asyncHandler(async (req, res, next) => {

  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    throw new AppError('Post not found', 404);
  }  
  res.json({ success: true, data: post });
} 
));

// POST /posts
router.post('/', asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
}));

// PUT /posts/:id
router.put('/:id', asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.json({ success: true, data: post });
}));

// DELETE /posts/:id
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  
  res.json({ success: true, data: post });
}));
    



module.exports = router;
