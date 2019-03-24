const fs = require('fs');
const express = require('express');
const compression = require('compression');

const domain = process.env.PORT ? 'theclevernode.com' : 'localhost:3000';

const app = express();
app.use(compression());

app.use(function redirect301(req, res, next) {
  if (req.get('Host') !== domain) {
    return res.redirect(301, `https://${domain}`);
  }

  return next();
});

app.use(express.static('build'));

const notFound = fs.readFileSync('build/404.html');

app.use(function (req, res) {
  res.status(404).send(notFound.toString());
});

app.listen(process.env.PORT || 3000);
