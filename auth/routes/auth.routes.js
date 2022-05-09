const router = require('express').Router();
const Validator = require('../../services/validator');
const UserController = require('../controllers/auth.controllers');
const $ = require('express-async-handler');

router.post(
  '/login',
  Validator(UserController.loginSchema),
  $(UserController.loginUser)
);

module.exports = router;
