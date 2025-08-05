const express = require('express');
const router = express.Router();
const path = require('path');

const resolve = (relativePath) => path.resolve(__dirname, relativePath);

const ProductoRepository = require(resolve('../repositories/productoRepository'));
const MovimientoRepository = require(resolve('../repositories/movimientoRepository'));
const ProductoService = require(resolve('../services/productoService'));
const ProductoController = require(resolve('../controllers/productoController'));

const productoRepository = new ProductoRepository();
const movimientoRepository = new MovimientoRepository();
const productoService = new ProductoService(productoRepository, movimientoRepository);
const productoController = new ProductoController(productoService);

router.post('/', (req, res) => productoController.crearProducto(req, res));
router.get('/', (req, res) => productoController.obtenerProductos(req, res));
router.get('/:id', (req, res) => productoController.obtenerProducto(req, res));
router.put('/:id', (req, res) => productoController.actualizarProducto(req, res));
router.delete('/:id', (req, res) => productoController.eliminarProducto(req, res));
router.get('/:id/historial', (req, res) => productoController.obtenerHistorialProducto(req, res));

module.exports = router;