// backend/models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);