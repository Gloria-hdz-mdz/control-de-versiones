require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventario')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Configuración de rutas estáticas
const frontendDir = path.join(__dirname, '..', 'frontend');
const indexPath = path.join(frontendDir, 'index.html');

// Servir archivos estáticos
app.use(express.static(frontendDir));

// Importar rutas con resolución segura
const productoRoutes = require(path.resolve(__dirname, 'routes/productoRoutes'));
const movimientoRoutes = require(path.resolve(__dirname, 'routes/movimientoRoutes'));

// Middleware de autenticación
const authMiddleware = require(path.resolve(__dirname, 'middlewares/authMiddleware'));

// Montar rutas API
app.use('/api/productos', productoRoutes);
app.use('/api/movimientos', authMiddleware, movimientoRoutes);

// Ruta de fallback para SPA
app.get('*', (req, res) => {
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Error: index.html no encontrado');
  }
  res.sendFile(indexPath);
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  Servidor funcionando en http://localhost:${PORT}
  Productos:   http://localhost:${PORT}/api/productos
  Movimientos: http://localhost:${PORT}/api/movimientos
  `);
});