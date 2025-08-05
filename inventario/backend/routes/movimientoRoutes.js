const express = require('express');
const router = express.Router();
const path = require('path');
const authMiddleware = require('../middlewares/authMiddleware');

const resolve = (relativePath) => path.resolve(__dirname, relativePath);

const MovimientoRepository = require(resolve('../repositories/movimientoRepository'));
const ProductoRepository = require(resolve('../repositories/productoRepository'));
const MovimientoService = require(resolve('../services/movimientoService'));
const MovimientoController = require(resolve('../controllers/movimientoController'));

const movimientoRepo = new MovimientoRepository();
const productoRepo = new ProductoRepository();
const movimientoService = new MovimientoService(movimientoRepo, productoRepo);
const movimientoController = new MovimientoController(movimientoService);

router.post('/', authMiddleware, (req, res) => movimientoController.crearMovimiento(req, res));
router.get('/:productoId/historial', authMiddleware, (req, res) => movimientoController.obtenerHistorial(req, res));

module.exports = router;