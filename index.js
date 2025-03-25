require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {}; // Stores short URLs
let urlId = 1; // Counter for generating unique short URLs

app.post("/api/shorturl", (req, res) => {
  // Logic for storing and validating URLs
    let { url: originalUrl } = req.body;

  // Check if the URL has a valid protocol
  const validProtocol = /^https?:\/\//i;
  if (!validProtocol.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Extract hostname (without protocol) for DNS lookup
  const hostname = url.parse(originalUrl).hostname;
  
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    // Store the URL and generate a short ID
    let shortUrl = urlId++;
    urlDatabase[shortUrl] = originalUrl;

    // Respond with the shortened URL data
    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  // Logic for redirecting to the original URL
  const shortUrl = Number(req.params.shorturl);

  // Check if the shortUrl exists in the database
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl); // Redirect to the original URL
  } else {
    return res.json({ error: "No short URL found" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
