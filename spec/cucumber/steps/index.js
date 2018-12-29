import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';
import { getValidPayload, convertStringToArray } from './utils';

When(
  /^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/,
  function (method, path) {
    this.request = superagent(
      method,
      `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOSTNAME}:${
        process.env.SERVER_PORT
      }${path}`,
    );
  },
);

When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .set('Content-Type', 'application/json')
        .send('{"email": "sherinbinu@hotmail.com", name:}');
      break;
    case 'non-JSON':
      this.request
        .send('<?xml version="1.0" encoding="UTF-8" ?><email>sherinbinu@hotmail.com</email> ')
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
  }
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (
  payloadType,
  missingFields,
) {
  const payload = getValidPayload(payloadType);
  const fieldsToDelete = convertStringToArray(missingFields);
  fieldsToDelete.forEach(field => delete payload[field]);
  this.request.send(JSON.stringify(payload)).set('Content-Type', 'application/json');
});

When(
  /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/,
  function (payloadType, fields, invert, type) {
    const payload = getValidPayload(payloadType);
    const typeKey = type.toLowerCase();
    const invertKey = invert ? 'not' : 'is';
    const sampleValues = {
      string: {
        is: 'string',
        not: 10,
      },
    };
    const fieldsToModify = convertStringToArray(fields);
    fieldsToModify.forEach((field) => {
      payload[field] = sampleValues[typeKey][invertKey];
    });
    this.request.send(JSON.stringify(payload)).set('Content-Type', 'application/json');
  },
);

When(
  /^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/,
  function (payloadType, fields, value) {
    const payload = getValidPayload(payloadType);
    const fieldsToModify = convertStringToArray(fields);
    fieldsToModify.forEach((field) => {
      payload[field] = value;
    });
    this.request.send(JSON.stringify(payload)).set('Content-Type', 'application/json');
  },
);

When(/^sends the request$/, function (callback) {
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

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the content type of the response should be JSON$/, function () {
  let contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  contentType = contentType.substring(
    contentType.indexOf('application/json'),
    'application/json'.length,
  );
  assert.equal(contentType, 'application/json');
});

Then(/^the payload of the response should be a JSON object$/, function () {
  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});

Then(/^contains an error property set to (true|false)$/, function (error) {
  assert.equal(this.responsePayload.error.toString(), error);
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});
