import * as mongoose from 'mongoose';
import { createHash } from 'src/shared/utils/createHash';

export const UserSchema = new mongoose.Schema({
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
      message: 'Formato de e-mail inválido',
    },
  },
  password: {
    type: String,
    required: true,
    min: [8, 'A senha deve ter pelo menos 8 caracteres'],
  },
  role: {
    type: String,
    enum: ['CLIENT', 'WAITER', 'ADMIN'],
    default: 'ADMIN',
  },
});

UserSchema.pre('save', async function (next) {
  try {
    const hashedPass = await createHash(this.password);
    this.password = hashedPass;
    next();
  } catch (error) {
    throw new Error('Erro ao criar o hash da senha:  ' + error.message);
  }
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate();

    if (update && typeof update === 'object' && !Array.isArray(update)) {
      const updateObj = update as mongoose.UpdateQuery<any>;

      if (updateObj.password) {
        updateObj.password = await createHash(updateObj.password);
        this.setUpdate(updateObj);
      }
    }
    next();
  } catch (error) {
    throw new Error('Erro ao criar o hash da senha: ' + error.message);
  }
});
