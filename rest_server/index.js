const express = require('express');
const consola = require('consola');
const userRoute = require('./users');
const bodyParser = require('body-parser');

const app = express();
const REST_API = 8000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.get('/', function(req, res) {
  return res.status(200).send('Simple REST API Using NodeJS & Express');
});

app.use('/api/user', userRoute);

app.listen(REST_API, function () {
  consola.ready({
    message: `Server REST listening on http://localhost:${REST_API}`,
    badge: true
  });
});