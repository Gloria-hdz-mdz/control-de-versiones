class ProductoController {
  constructor(service) {
    this.service = service;
  }

  async crearProducto(req, res) {
    try {
      const producto = await this.service.crearProducto(req.body);
      res.status(201).json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async obtenerProductos(req, res) {
    try {
      const productos = await this.service.obtenerProductos();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async obtenerProducto(req, res) {
    try {
      const producto = await this.service.obtenerProductoPorId(req.params.id);
      res.json(producto);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async actualizarProducto(req, res) {
    try {
      const producto = await this.service.actualizarProducto(req.params.id, req.body);
      res.json(producto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async eliminarProducto(req, res) {
    try {
      await this.service.eliminarProducto(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async obtenerHistorialProducto(req, res) {
    try {
      const historial = await this.service.obtenerHistorialProducto(req.params.id);
      res.json(historial);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = ProductoController;