import ValidationError from '../../validators/ValidationError';
import validate from '../../validators/user.validation';
import User from '../../models/user.model';

const create = (req, res) => {
  const validationResults = validate.createvalidation(req);
  if (validationResults instanceof ValidationError) {
    return res.status(400).json({
      error: true,
      code: '111',
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

export default { create };
