export default (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
};
