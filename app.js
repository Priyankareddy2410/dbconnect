const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', itemSchema);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.get('/api/items/:itemId', async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(item);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/items/:itemId', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(updatedItem);
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.delete('/api/items/:itemId', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) {
      res.status(404).json({ error: 'Item not found' });
    } else {
      res.json(deletedItem);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
