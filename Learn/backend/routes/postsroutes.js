const express = require('express');
const router  = express.Router();
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Data lives here for now — moves to a database on Day 6
let posts = [
  { id: 1, title: 'Getting Started with Node.js',   content: 'Node.js is a JavaScript runtime built on Chrome V8 engine.', author: 'Yojjal',  tags: ['node', 'javascript'], createdAt: '2025-01-01T10:00:00Z' },
  { id: 2, title: 'Why Express Makes Life Easier',  content: 'Express is a minimal web framework for Node.js.',              author: 'Yojjal',  tags: ['express', 'node'],   createdAt: '2025-01-02T09:00:00Z' },
  { id: 3, title: 'Understanding REST APIs',        content: 'REST stands for Representational State Transfer.',              author: 'Student', tags: ['rest', 'api'],       createdAt: '2025-01-03T11:00:00Z' },
];
let nextId = 4;

// GET /posts
router.get('/', asyncHandler(async(req, res) => {
  const { author } = req.query;
  if (author) {
    return res.json({
      success: true,
      data: posts.filter(p => p.author.toLowerCase() === author.toLowerCase()),
    });
  }
  res.json({ success: true, data: posts });
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
  try{
  const { title, content, author, tags } = req.body;
  if (!title || !content || !author) {
    throw new AppError('Missing required fields: title, content, and author are required', 400);
  }
  const newPost = { id: nextId++, title, content, author, tags: tags || [], createdAt: new Date().toISOString() };
  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost }); 
} catch (error) {
  next(error);
}
}));

// PUT /posts/:id
router.put('/:id', asyncHandler(async (req, res, next) => {
  
    const id = parseInt(req.params.id);

  const index = posts.findIndex(p => p.id === id);
  if (index === -1) {
    throw new AppError('Post not found', 404);
  }
  const { title, content, author, tags } = req.body;
  if (!title || !content || !author) {
    throw new AppError('Missing required fields: title, content, and author are required', 400);
  }
  posts[index] = { id, title, content, author, tags: tags || [], createdAt: posts[index].createdAt, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: posts[index] });
  } 
));

// DELETE /posts/:id
router.delete('/:id', asyncHandler(async (req, res, next) => {

    const id = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new AppError('Post not found', 404);
    }
    const deleted = posts.splice(index, 1)[0];
    res.json({ success: true, data: deleted });
  } 
  
));
router.delete('/:id', asyncHandler(async (req, res, next) => {
  const id    = parseInt(req.params.id);
  const index = posts.findIndex(p => p.id === id);  
  const deleted = posts.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
}));


module.exports = router;