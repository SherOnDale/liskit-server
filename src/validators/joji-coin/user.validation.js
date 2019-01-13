import ValidationError from '../ValidationError';

function createvalidation(req) {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.entropy) {
    return new ValidationError(
      'Payload must contain at least the email, username ,password and entropy fields',
    );
  }

  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
    || typeof req.body.username !== 'string'
    || typeof req.body.entropy !== 'string'
  ) {
    return new ValidationError(
      'The email, username, password ad entropy fields must be of type string',
    );
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError('The email field must be a valid email');
  }

  if (req.body.entropy.length < 32) {
    return new ValidationError('The length of the entropy should be atleast 32');
  }
}

export default { createvalidation };
