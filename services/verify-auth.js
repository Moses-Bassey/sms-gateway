const { upperFirst } = require('lodash');
const UserModel = require('../auth/models/auth.model');

module.exports = class {
  static async checkRole({ role, id }) {
    const method = `check${upperFirst(role)}`;
    if (!this[method]) {
      return Promise.reject('role does not exist');
    }

    return this[method]({
      id,
    });
  }

  static async checkUser({ id }) {
    return UserModel.findOne({
      _id: id,
    });
  }
};
