const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const JojiUser = require('../../models/joji-coin/user.model');

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({
    error: false,
    code: '069',
    message: 'Successfully signed out',
  });
};

const requireSignin = expressJwt({
  secret: process.env.JWT_KEY,
  userProperty: 'auth',
});

const signin = (req, res) => {
  JojiUser.findOne(
    {
      username: req.body.username,
    },
    (error, user) => {
      if (error || !user) {
        return res.status(401).json({
          error: true,
          code: '169',
          message: 'User not found',
        });
      }

      if (!user.authenticate(req.body.password)) {
        return res.status(401).json({
          error: true,
          code: '170',
          message: 'Email and Password does not match.',
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
          expiry: Date.now() + 1000 * 60 * 60,
        },
        process.env.JWT_KEY,
      );
      res.cookie('t', token, {
        expire: Date.now() + 1000 * 60 * 60,
      });

      return res.json({
        error: false,
        code: '070',
        message: 'Successfully logged in',
        payload: {
          token,
          username: user.username,
          expiresIn: 1000 * 60 * 60,
        },
      });
    },
  );
};

export default { signout, requireSignin, signin };
