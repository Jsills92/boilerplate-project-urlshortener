require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

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

app.get("/api/whoami", (req, res) => {
  
  // Get the user's IP address (from the 'x-forwarded-for' header or the default 'req.ip' if behind a proxy)
  let ipaddress = req.headers['x-forwarded-for'] || req.ip;
  // Get the user's preferred language (Accept-Language header)
  let language = req.headers['accept-language'].split(',')[0]; // Just the first language in the list
  // Get the user's software (User-Agent header)
  let software = req.headers['user-agent'];

  // Respond with JSON object including ipaddress, language, and software
  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
