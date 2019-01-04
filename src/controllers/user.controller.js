import User from '../models/user.model';

const create = (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).json({
      error: true,
      message: 'Payload should not be empty',
    });
  }
  if (!req.body.email || !req.body.password || !req.body.username) {
    return res.status(400).json({
      error: true,
      message: 'Payload must contain at least the email and password fields',
    });
  }
  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
    || typeof req.body.username !== 'string'
  ) {
    return res.status(400).json({
      error: true,
      message: 'The email, password and username fields must be of type string',
    });
  }
  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return res.status(400).json({ error: true, message: 'The email field must be a valid email' });
  }

  // const { email, password, username } = req.body;
  const user = new User(req.body);
  user.save((error, newUser) => {
    if (error) {
      console.log(req.body);
      console.log(error);
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

export default { create };
