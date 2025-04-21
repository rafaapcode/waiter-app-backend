import * as mongoose from 'mongoose';
import { createHash } from 'src/utils/createHash';

export const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email address format',
    },
  },
  password: {
    type: String,
    required: true,
    min: [8, 'The password must have at least 8 characters'],
  },
});

AdminSchema.pre('save', async function (next) {
  try {
    const hashedPass = await createHash(this.password);
    this.password = hashedPass;
    next();
  } catch (error) {
    throw new Error('Error to hash the password' + error.message);
  }
});
