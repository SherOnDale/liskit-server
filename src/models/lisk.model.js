import mongoose from 'mongoose';

const { Schema } = mongoose;

const LiskItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const LiskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  private: {
    type: Boolean,
    required: true,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  liskItems: [
    {
      type: LiskItemSchema,
      required: true,
    },
  ],
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Lisk',
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Lisk',
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  updated: Date,
});

export default mongoose.model('Lisk', LiskSchema);
