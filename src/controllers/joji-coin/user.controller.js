import web3 from 'web3';
import ValidationError from '../../validators/ValidationError';
import validate from '../../validators/joji-coin/user.validation';
import JojiUser from '../../models/joji-coin/user.model';

const create = (req, res) => {
  const validationResults = validate.createvalidation(req);
  if (validationResults instanceof ValidationError) {
    return res.status(400).json({
      error: true,
      code: '111',
      message: validationResults.message,
    });
  }

  const userAccount = web3.eth.accounts.create(req.body.entropy);

  const { email, password, username } = req.body;
  const user = new JojiUser({
    email,
    password,
    username,
    ethAddress: userAccount.address,
  });

  user.save((error, newUser) => {
    if (error) {
      return res.status(500).json({
        error: true,
        code: '999',
        message: 'Error signing up. Please try again later',
      });
    }
    return res.status(201).json({
      error: false,
      code: '011',
      message: 'Successfully created a new user',
      payload: {
        userId: newUser._id,
      },
    });
  });
};

const list = (req, res) => {
  JojiUser.find({})
    .sort({ updated: -1 })
    .skip(0)
    .limit(10)
    .exec((error, users) => {
      if (error) {
        return res.status(500).json({
          error: true,
          code: '110',
          message: 'Error retreiving user list. Please try again later',
        });
      }
      return res.status(200).json({
        error: false,
        code: '010',
        message: 'Successfullly retrieved the user list',
        payload: {
          users,
        },
      });
    });
};

export default { create, list };
