export default (req, res, next) => {
  if (!req.headers['content-type'].includes('application/json')) {
    return res.status(415).json({
      error: true,
      message: 'The "Content-Type" header must always be "application/json"',
    });
  }
  next();
};
