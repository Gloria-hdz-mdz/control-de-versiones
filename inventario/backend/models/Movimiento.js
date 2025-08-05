const mongoose = require('mongoose');

const MovimientoSchema = new mongoose.Schema({
  producto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tipo: {
    type: String,
    enum: ['entrada', 'salida'],
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movimiento', MovimientoSchema);