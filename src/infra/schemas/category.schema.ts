import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Org',
  },
});
