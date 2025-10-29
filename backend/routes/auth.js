const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Register
router.post('/register', async (req, res) => {
try {
const { email, password } = req.body;
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'User exists' });
const user = new User({ email, password });
await user.save();
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, email: user.email });
} catch (err) { res.status(500).json({ message: err.message }); }
});


// Login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid creds' });
const ok = await user.comparePassword(password);
if (!ok) return res.status(400).json({ message: 'Invalid creds' });
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, email: user.email });
} catch (err) { res.status(500).json({ message: err.message }); }
});


module.exports = router;