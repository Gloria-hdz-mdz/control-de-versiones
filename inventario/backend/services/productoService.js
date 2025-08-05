class ProductoService {
  constructor(productoRepository, movimientoRepository) {
    this.productoRepository = productoRepository;
    this.movimientoRepository = movimientoRepository;
  }

  async crearProducto(productoData) {
    if (!productoData.nombre || productoData.nombre.trim() === '') {
      throw new Error('El nombre del producto es obligatorio');
    }
    
    if (productoData.stock_inicial === undefined) {
      throw new Error('El stock inicial es obligatorio');
    }
    
    if (productoData.stock_inicial < 0) {
      throw new Error('El stock inicial no puede ser negativo');
    }
    
    const existe = await this.productoRepository.existeConNombre(productoData.nombre);
    if (existe) {
      throw new Error('Ya existe un producto con ese nombre');
    }
    
    return this.productoRepository.crear(productoData);
  }

  async obtenerProductos() {
    return this.productoRepository.obtenerTodos();
  }

  async obtenerProductoPorId(id) {
    if (!id || id.length !== 24) {
      throw new Error('ID de producto inválido');
    }
    
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  async actualizarProducto(id, productoData) {
    const existe = await this.productoRepository.existe(id);
    if (!existe) {
      throw new Error('Producto no encontrado');
    }
    
    if (productoData.stock_inicial !== undefined && productoData.stock_inicial < 0) {
      throw new Error('El stock no puede ser negativo');
    }
    
    if (productoData.nombre) {
      const productoConMismoNombre = await this.productoRepository.obtenerPorNombre(productoData.nombre);
      if (productoConMismoNombre && productoConMismoNombre._id.toString() !== id) {
        throw new Error('Ya existe otro producto con ese nombre');
      }
    }
    
    return this.productoRepository.actualizar(id, productoData);
  }

  async eliminarProducto(id) {
    const producto = await this.productoRepository.obtenerPorId(id);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    const tieneMovimientos = await this.movimientoRepository.existenMovimientosParaProducto(id);
    if (tieneMovimientos) {
      throw new Error('No se puede eliminar un producto con movimientos registrados');
    }
    
    return this.productoRepository.eliminar(id);
  }

  async obtenerHistorialProducto(productoId) {
    const existe = await this.productoRepository.existe(productoId);
    if (!existe) {
      throw new Error('Producto no encontrado');
    }
    
    return this.movimientoRepository.obtenerPorProducto(productoId);
  }
}

module.exports = ProductoService;