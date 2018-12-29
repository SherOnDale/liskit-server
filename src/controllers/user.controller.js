const create = (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).json({
      error: true,
      message: 'Payload should not be empty',
    });
  }
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      error: true,
      message: 'Payload must contain at least the email and password fields',
    });
  }
  if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string') {
    return res.status(400).json({
      message: 'The email and password fields must be of type string',
    });
  }
  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return res.status(400).json({ message: 'The email field must be a valid email' });
  }
  return res.status(200).json({
    error: false,
    message: 'Successfully created a new user',
  });
};

export default { create };
