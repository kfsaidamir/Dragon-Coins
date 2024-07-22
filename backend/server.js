const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.json());

// Определение схемы и модели данных
const cardSchema = new mongoose.Schema({
  level: Number,
  upgradeCost: Number,
  icon: String
});

const Card = mongoose.model('Card', cardSchema);

// API маршруты
app.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/cards', async (req, res) => {
  const card = new Card({
    level: req.body.level,
    upgradeCost: req.body.upgradeCost,
    icon: req.body.icon
  });
  try {
    const newCard = await card.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
