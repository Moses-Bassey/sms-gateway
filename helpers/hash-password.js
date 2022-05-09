const crypto = require('crypto');
const { SHA_512_HASH } = process.env;

module.exports = {
  hashPassword(password) {
    const hash = crypto.createHash('sha512', '');

    return hash.update(`${password}${SHA_512_HASH}`).digest('hex');
  },
  comparePassword(password, hash) {
    return password === hash;
  },
};
