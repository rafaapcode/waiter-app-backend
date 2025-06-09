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
  description: {
    type: String,
    required: true,
    min: [5, 'A descrição deve ter pelo menos 5 caracteres'],
  },
  openHour: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9][Hh]$/.test(value);
      },
      message:
        'Formato de horário inválido. Use o formato HH:MMH ou HH:MMh (ex: 12:30H)',
    },
  },
  closeHour: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9][Hh]$/.test(value);
      },
      message:
        'Formato de horário inválido. Use o formato HH:MMH ou HH:MMh (ex: 12:30H)',
    },
  },
  cep: {
    type: String,
    required: true,
    validate: {
      validator: function (value: string) {
        return /^[0-9]{5}-?[0-9]{3}$/.test(value);
      },
      message: 'Formato de CEP inválido. Use o formato 12345-678 ou 12345678',
    },
  },
  city: {
    type: String,
    required: true,
  },
  neighborhood: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },
});
