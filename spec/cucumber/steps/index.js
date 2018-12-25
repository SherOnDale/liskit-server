import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';

When('the client creates a POST request to /users', function () {
  this.request = superagent(
    'POST',
    `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${
      process.env.SERVER_PORT
    }/liskit/user`,
  );
});

When('attaches a generic empty payload', function () {
  return undefined;
});

When('sends the request', function (callback) {
  this.request
    .then((response) => {
      this.response = response.res;
      callback();
    })
    .catch((errResponse) => {
      this.response = errResponse.response;
      callback();
    });
});

Then('our API should respond with a 400 HTTP status code', function () {
  assert.equal(this.response.statusCode, 400);
});

Then('the content type of the response should be JSON', function () {
  let contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  contentType = contentType.substring(
    contentType.indexOf('application/json'),
    'application/json'.length,
  );
  assert.equal(contentType, 'application/json');
});

Then('the payload of the response should be a JSON object', function () {
  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});

Then('contains a message property which says "Payload should not be empty"', function () {
  console.log(this.responsePayload);
  assert.equal(this.responsePayload.message, 'Payload should not be empty');
});
