import mongoose from 'mongoose';
import crypto from 'crypto';

const { Schema } = mongoose;

const UserSchema = new Schema({
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
  email: {
    type: String,
    trim: true,
    required: 'Email Address is required.',
    unique: 'Email Address already exists.',
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  lisks: [
    {
      type: Schema.ObjectId,
      ref: 'Lisk',
    },
  ],
  profile: {
    name: {
      first: String,
      last: String,
    },
    bio: String,
    social: {
      github: String,
    },
  },
  salt: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

UserSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hash = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.methods = {
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
  makeSalt() {
    return `${Math.round(new Date().valueOf() * Math.random())}`;
  },
};

UserSchema.path('hash').validate(function () {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be atleast 6 characters.');
  }

  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required.');
  }
});

export default mongoose.model('User', UserSchema);
