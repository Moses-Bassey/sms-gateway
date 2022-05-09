const Joi = require('joi');
const AuthRepository = require('../repositories/auth.repository');

module.exports = class {
  // eslint-disable-next-line no-unused-vars
  static get loginSchema() {
    return Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
  }

  static async loginUser(req, res) {
    res.data(await AuthRepository.login(req.body));
  }

};
