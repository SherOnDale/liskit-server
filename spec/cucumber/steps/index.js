import superagent from 'superagent';
import { When, Then } from 'cucumber';
import assert from 'assert';
import mongoose from 'mongoose';
import User from '../../../dist/models/user.model';
import { getValidPayload, convertStringToArray } from './utils';

mongoose.set('useCreateIndex', true);
mongoose.connect(
  `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_HOSTNAME}/${process.env.MONGO_DB}`,
  { useNewUrlParser: true },
);

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

When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType);
  this.request.set('Content-Type', 'application/json').send(JSON.stringify(this.requestPayload));
});

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

Then(/^contains a payload property of type object$/, function () {
  assert.equal(typeof this.responsePayload.payload, 'object');
});

Then(/^the payload contains a property ([a-zA-Z]+) of type ([a-z]+)$/, function (
  propertyName,
  type,
) {
  assert.equal(typeof this.responsePayload.payload[propertyName], type);
});

Then(
  /^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/,
  function (type, callback) {
    this.type = type;
    if (type === 'user') {
      User.findById(this.responsePayload.payload.userId, (error, user) => {
        if (error) callback(error);
        assert.equal(user.email, this.requestPayload.email);
        callback();
      });
    }
  },
);

Then(/^the newly-created user should be deleted$/, function (callback) {
  User.deleteOne({ _id: this.responsePayload.payload.userId })
    .then(() => {
      callback();
    })
    .catch(callback);
});
