const Joi = require('joi');
const SmsRepository = require('../repositories/sms.repository');

module.exports = class {
  static get smsSchema() {
    return Joi.object().keys({
      from: Joi.string().min(6).max(16).required(),
      to: Joi.string().min(6).max(16).required(),
      text: Joi.string().min(1).max(120).required(),
    });
  }

  static async sms(req, res) {
    const account = req.user;
    const response = await SmsRepository.inboundSms({ ...req.body, account });

    res.data(response);
  }

  static async outSms(req, res) {
    const account = req.user;
    const response = await SmsRepository.outboundSms({ ...req.body, account });

    res.data(response);
  }
};
