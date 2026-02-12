// ===== IMPORTS =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Url = require('./models/Url');
const shortid = require('shortid');

// ===== CREATE APP =====
const app = express();

// ===== CONNECT MONGODB =====
mongoose.connect(
  process.env.MONGO_URI ||
  "mongodb+srv://my6644866448_db_user:Mohit17102004@cluster0.fg6t6wb.mongodb.net/?appName=Cluster0"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== ROUTES =====

// create short URL
app.post('/shorten', async (req, res) => {
  const longUrl = req.body.url;
  const shortCode = shortid.generate();

  try {
    const newUrl = new Url({
      longUrl,
      shortCode
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:5000/${shortCode}`
    });

  } catch (err) {
    res.status(500).send('Error saving URL');
  }
});

// analytics route
app.get('/stats/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
      res.json({
        longUrl: url.longUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt
      });
    } else {
      res.status(404).send('No data found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// history route (NEW)
app.get('/history', async (req, res) => {
  try {
    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(urls);
  } catch (err) {
    res.status(500).send('Error fetching history');
  }
});

// redirect route (ALWAYS LAST)
app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).send('URL not found');
    }
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ===== START SERVER =====
app.listen(5000, () => {
  console.log('Server started on port 5000');
});
