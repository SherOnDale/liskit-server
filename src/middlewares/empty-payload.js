export default (req, res, next) => {
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && req.headers['content-length'] === '0') {
    return res.status(400).json({
      error: true,
      message: 'Payload should not be empty',
    });
  }
  next();
};
