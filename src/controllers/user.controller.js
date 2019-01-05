import ValidationError from '../validators/ValidationError';
import validate from '../validators/user.validation';
import User from '../models/user.model';

const create = (req, res) => {
  const validationResults = validate.createvalidation(req);
  if (validationResults instanceof ValidationError) {
    return res.status(400).json({
      error: true,
      message: validationResults.message,
    });
  }

  const { email, password, username } = req.body;
  const user = new User({
    email,
    password,
    username,
  });
  user.save((error, newUser) => {
    if (error) {
      return res.status(500).json({
        error: true,
        message: 'Error signing up. Please try again later',
      });
    }
    return res.status(201).json({
      error: false,
      message: 'Successfully created a new user',
      payload: {
        userId: newUser._id,
      },
    });
  });
};

const list = (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      return res.status(500).json({
        error: true,
        code: '101',
        message: 'Error retreiving user list. Please try again later',
      });
    }
    return res.status(200).json({
      error: false,
      code: '001',
      message: 'Successfullly retrieved the user list',
      payload: {
        users,
      },
    });
  });
};

export default { create, list };
