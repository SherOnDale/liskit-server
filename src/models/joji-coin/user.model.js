import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema } = mongoose;

const JojiUserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: 'Username is required.',
    unique: 'Username is taken.',
  },
  hash: {
    type: String,
    required: 'Passowrd is required.',
  },
  hashedEmail: {
    type: String,
    required: 'Email Address is required.',
    unique: 'Email Address is already in use.',
  },
  ethAddress: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  emailSalt: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

JojiUserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hash = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

JojiUserSchema.virtual('email')
  .set(function (email) {
    this._email = email;
    this.emailSalt = this.makeSalt();
    this.hashedEmail = this.encryptEmail(email);
  })
  .get(function () {
    return this._email;
  });

JojiUserSchema.methods = {
  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hash;
  },
  encryptPassword(password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  encryptEmail(email) {
    if (!email) return '';
    try {
      return crypto
        .createHmac('sha1', this.emailSalt)
        .update(email)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },
  makeSalt() {
    return `${Math.round(new Date().valueOf() * Math.random())}`;
  },
};

export default mongoose.model('JojiUser', JojiUserSchema);
