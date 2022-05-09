const { Model, DataTypes, Op } = require('sequelize');
const { seq: DB } = require('../../sequelize');
const redis = require('redis');
const moment = require('moment');

const cacheText = ['STOP', 'STOP\n', 'STOP\r', 'STOP\r\n'];

const redisPort = 6379;
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected!');
});

client.on('error', (err) => {
  console.log(err);
});
let countAPI = 1;

(async () => await client.connect())();

class PhoneNumbers extends Model {
  static async inboundSms({ account, ...data }) {
    const accountExist = await this.findOne({
      where: {
        [Op.and]: [{ number: data.to }, { account_id: account.id }],
      },
    });

    if (!accountExist) {
      return Promise.reject('to parameter not found');
    }

    let from = data.from;
    let to = data.to;
    if (cacheText.includes(data.text)) {
      await client.set('from', from, 'EX', 60 * 4);
      await client.set('to', to, 'EX', 60 * 4);
    }

    return { message: 'Inbound sms Ok' };
  }

  static async outboundSms({ account, ...data }) {
    const accountExist = await this.findOne({
      where: {
        [Op.and]: [{ number: data.from }, { account_id: account.id }],
      },
    });

    if (!accountExist) {
      return Promise.reject('from parameter not found');
    }

    let from = data.from;
    let to = data.to;

    let fromObject = {
      from,
      count: countAPI,
    };
    let fromData = await client.get('from');
    let toData = await client.get('to');

    if (from == fromData || to == toData) {
      return Promise.reject('Matched cached found');
    }

    await client.set(from, countAPI, 'EX', 60 * 60 * 24);
    let callRecord = await client.get(from);
    countAPI++;

    let otpExpiresAt;

    if (callRecord > 0) {
      otpExpiresAt = moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
    }

    if (callRecord > 50) {
      console.log(callRecord);
      const expiryTime = moment().diff(moment(otpExpiresAt), 'hours');
      if (expiryTime < 24) {
        otpExpiresAt = moment().add(24, 'hours').format('YYYY-MM-DD HH:mm:ss');
        return Promise.reject('API calls elasped');
      }
    }

    return { message: 'Inbound sms Ok' };
  }
}

PhoneNumbers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
    },

    account_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'phone_number',
    // underscored: true,
    timestamps: false,
    sequelize: DB,
  }
);

module.exports = PhoneNumbers;
