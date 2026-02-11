const Url = require('./models/Url');
const shortid = require('shortid');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const express = require('express');

const app = express();

// allow server to read JSON data
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server running');
});

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





app.listen(5000, () => {
  console.log('Server started on port 5000');
});
