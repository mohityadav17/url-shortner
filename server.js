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
app.use(cors());                    // allow frontend requests
app.use(express.json());            // read JSON body
app.use(express.static('public'));  // serve frontend HTML

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

    res.send(`Short URL created: http://localhost:5000/${shortCode}`);
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
