class MovimientoService {
  constructor(movimientoRepo, productoRepo) {
    this.movimientoRepo = movimientoRepo;
    this.productoRepo = productoRepo;
  }

  async registrarMovimiento(movimientoData) {
    if (!['entrada', 'salida'].includes(movimientoData.tipo)) {
      throw new Error('Tipo de movimiento inválido');
    }
    
    if (movimientoData.cantidad <= 0) {
      throw new Error('Cantidad debe ser positiva');
    }

    const productoExiste = await this.productoRepo.existe(movimientoData.producto_id);
    if (!productoExiste) {
      throw new Error('Producto no encontrado');
    }

    const producto = await this.productoRepo.obtenerPorId(movimientoData.producto_id);
    const stockInicial = producto.stock_inicial;

    const movimientosPrevios = await this.movimientoRepo.obtenerPorProducto(movimientoData.producto_id);
    
    let stockActual = stockInicial;
    for (const mov of movimientosPrevios) {
      stockActual += mov.tipo === 'entrada' ? mov.cantidad : -mov.cantidad;
    }

    if (movimientoData.tipo === 'salida' && movimientoData.cantidad > stockActual) {
      throw new Error('Stock insuficiente');
    }

    return this.movimientoRepo.crear({
      ...movimientoData,
      fecha: new Date()
    });
  }

  async obtenerHistorial(productoId) {
    return this.movimientoRepo.obtenerPorProducto(productoId);
  }
}

module.exports = MovimientoService;