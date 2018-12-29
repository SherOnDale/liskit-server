export default (error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).send({
      error: true,
      message: 'Payload should be in JSON format',
    });
  }
  next();
};
