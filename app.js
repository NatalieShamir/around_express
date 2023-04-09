const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const bodyParser = require('body-parser');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const { NOT_FOUND_STATUS, NOT_FOUND_ERR_MESSAGE } = require('./utils');

const allowedCors = [
  'https://practicum.tk',
  'http://practicum.tk',
  'localhost:3000'
];

app.use(function (req, res, next) {
  const { origin } = req.headers;

  req.user = {
    _id: '63ff36be8d3ba41c9b7ff7c1',
  };

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send(NOT_FOUND_ERR_MESSAGE);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);//eslint-disable-line
});
