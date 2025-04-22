const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

const SECRET_KEY = 'bratya_secret'; // вынеси в .env, если стесняешься

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(11)
  const hashed = await bcrypt.hash(password, 10);
  await db('users').insert({ email, password: hashed });

  res.json({ message: 'Пользователь зарегистрирован' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await db('users').where({ email }).first();
  if (!user) return res.status(400).json({ error: 'Неверный email' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Неверный пароль' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
