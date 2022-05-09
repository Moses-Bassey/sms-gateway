const router = require('express').Router();
const Validator = require('../../services/validator');
const SMSController = require('../controllers/sms.controller');
const $ = require('express-async-handler');

router.post(
  '/inbound/sms/',
  Validator(SMSController.smsSchema),
  $(SMSController.sms)
);

router.post(
  '/outbound/sms/',
  Validator(SMSController.smsSchema),
  $(SMSController.outSms)
);

module.exports = router;
