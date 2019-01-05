import ValidationError from './ValidationError';

function createvalidation(req) {
  if (!req.body.email || !req.body.password || !req.body.username) {
    return new ValidationError(
      'Payload must contain at least the email, username and password fields',
    );
  }

  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
    || typeof req.body.username !== 'string'
  ) {
    return new ValidationError('The email, username and password fields must be of type string');
  }

  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError('The email field must be a valid email');
  }
}

export default { createvalidation };
