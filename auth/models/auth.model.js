const { Model, DataTypes, Op } = require('sequelize');
const { seq: DB } = require('../../sequelize');
const jwt = require('../../helpers/jwt');
const {
  hashPassword,
  comparePassword,
} = require('../../helpers/hash-password');
const _ = require('lodash');

class User extends Model {
  /**
   * Sign In a User
   * @param {Object} params
   * @param {string} params.username
   * @param {string} params.password
   * @returns
   */
  static async login(data) {
    const { username, password } = data;
    const userExist = await this.findOne({
      where: {
        username,
        auth_id: password,
      },
    });

    if (!userExist) {
      return Promise.reject('username or password incorrect');
    }

    const token = await jwt.sign({
      id: userExist.id,
      spc: userExist.username,
      role: 'User',
    });

    return _.omit(
      {
        ...userExist.toJSON(),
        token,
      },
      ['auth_id']
    );
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
    },

    auth_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'account',
    // underscored: true,
    timestamps: false,
    sequelize: DB,
  }
);

module.exports = User;
