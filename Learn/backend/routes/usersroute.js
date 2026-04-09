/* global module */
const express = require('express');
const router  = express.Router();

let users = [
  { id: 1, name: 'Yojjal',  email: 'yojjal@blog.com',  role: 'admin'  },
  { id: 2, name: 'Student', email: 'student@blog.com', role: 'author' },
];
let nextUserId = 3;

// GET /users
router.get('/', (req, res) => {
  res.json({ success: true, data: users });
});

// GET /users/:id
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

// POST /users
router.post('/', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'name and email are required' });
  }
  const emailExists = users.some(u => u.email === email);
  if (emailExists) {
    return res.status(409).json({ success: false, error: 'Email already in use' });
  }
  const newUser = { id: nextUserId++, name, email, role: role || 'author' };
  users.push(newUser);
  res.status(201).json({ success: true, data: newUser });
});

// PUT /users/:id
router.put('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });
  const { name, email, role } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, error: 'name and email are required' });
  users[index] = { id, name, email, role: role || users[index].role };
  res.json({ success: true, data: users[index] });
});

// DELETE /users/:id
router.delete('/:id', (req, res) => {
  const id    = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ success: false, error: 'User not found' });
  const deleted = users.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

module.exports = router;