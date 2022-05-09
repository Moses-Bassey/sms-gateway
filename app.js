require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const customExpress = Object.create(express().response, {
  data: {
    value(data, status = true) {
      return this.type('json').json({
        status,
        data,
      });
    },
  },
  error: {
    value(error, message = 'An error occured') {
      return this.json({
        message,
        statusCode: -3,
        status: false,
        error,
      });
    },
  },
  errorMessage: {
    value(message = 'API response message') {
      return this.json({
        message,
        status: false,
        statusCode: 1,
      });
    },
  },
});

app.response = Object.create(customExpress);

app.use(cors());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.on('error', (err) => {
  console.log(err);
});

const authMiddleware = require('./services/verifytoken');

const inboundSMSRoute = require('./sms/routes/index.routes');

const authRoute = require('./auth/routes/auth.routes');

app.use((req, res, next) => {
  if (req.query.limit || req.query.offset) {
    req.query.limit = +req.query.limit || 20;
    req.query.offset = +req.query.offset || 0;
  }
  next();
});

app.get('/', (req, res) =>
  res.json({
    status: 'SUCCESS',
    message: '***API ONLINE***',
  })
);

app.use('/', authRoute);

app.use(
  '/',
  (req, res, next) => {
    if (req.method !== 'POST') {
      return res.status(405).error('HTTP Method not allowed');
    }
    next();
  },
  authMiddleware({ allowedRoles: ['USER'] }),
  inboundSMSRoute
);

app.use((err, req, res, next) => {
  if (err.type && err.type === 'entity.parse.failed') {
    res.status(400).errorMessage('Invalid JSON payload passed.');
  } else if (err.toString() === '[object Object]') {
    try {
      res.status(405).error(err);
    } catch {
      res.status(500).error('Server error');
    }
  } else {
    res.status(405).error(err.toString());
  }
});


module.exports = app;
