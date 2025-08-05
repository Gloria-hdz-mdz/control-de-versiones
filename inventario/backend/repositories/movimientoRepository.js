const Movimiento = require('../models/Movimiento');

class MovimientoRepository {
  async crear(movimientoData) {
    return Movimiento.create(movimientoData);
  }

  async obtenerPorProducto(productoId) {
    return Movimiento.find({ producto_id: productoId })
      .populate('usuario_id', 'nombre')
      .sort({ fecha: -1 });
  }

  async obtenerTodos() {
    return Movimiento.find().populate('producto_id usuario_id', 'nombre');
  }
  
  async existenMovimientosParaProducto(productoId) {
    const count = await Movimiento.countDocuments({ producto_id: productoId });
    return count > 0;
  }
}

module.exports = MovimientoRepository;