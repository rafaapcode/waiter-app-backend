import * as mongoose from 'mongoose';

export const OrgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: function (value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Formato de e-mail inválido',
    },
  },
  descricao: {
    type: String,
    required: true,
    min: [5, 'A descrição deve ter pelo menos 5 caracteres'],
  },
  info: {
    type: {
      abertura: {
        type: String,
      },
      fechamento: {
        type: String,
      },
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },
});
