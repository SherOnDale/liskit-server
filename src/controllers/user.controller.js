const create = (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    return res.status(400).json({
      error: true,
      message: 'Payload should not be empty',
    });
  }
  if (req.body.email && req.body.password) {
    return res.status(200).json({
      error: false,
      message: 'Successfully created a new user',
    });
  }
  return res.status(400).json({
    error: true,
    message: 'Payload must contain at least the email and password fields',
  });
};

export default { create };
