const jwt = require('../helpers/jwt');
const verifyAuth = require('./verify-auth');

const isAllowedRoles = (allowedRoles, role) => {
  allowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return allowedRoles
    .map((allowedRole) => allowedRole.toUpperCase())
    .includes(role.toUpperCase());
};

module.exports =
  ({ allowedRoles }) =>
  async (req, res, next) => {
    const authorization = req.headers.authorization.split(' ')[1];

    const decoded = await jwt.verify(authorization);

    if (!decoded || !authorization) {
      return res.status(403).json({
        status: false,
        error: 'Invalid authorization token',
      });
    }

    const { role } = decoded;

    try {
      const verified = await verifyAuth.checkRole({
        role,
        id: decoded.id,
      });

      if (!verified) {
        throw 'invalid auth token';
      }

      req.user = verified;
      req.role = role;
      if (req.role) {
        if (isAllowedRoles(allowedRoles, req.role)) {
          return next();
        } else {
          return res
            .status(403)
            .errorMessage('You are not authorized to perform this action');
        }
      }
    } catch (err) {
      console.log({ type: 'danger', msg: 'invalid token ::: ' + err });
      return res.status(403).json({
        status: false,
        error: err,
      });
    }
  };
