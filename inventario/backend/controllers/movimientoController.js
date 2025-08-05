class MovimientoController {
  constructor(service) {
    this.service = service;
  }

  async crearMovimiento(req, res) {
    try {
      const movimiento = await this.service.registrarMovimiento({
        ...req.body,
        usuario_id: req.user.id
      });
      res.status(201).json(movimiento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async obtenerHistorial(req, res) {
    try {
      const historial = await this.service.obtenerHistorial(req.params.productoId);
      res.json(historial);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MovimientoController;