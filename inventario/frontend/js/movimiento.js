// frontend/js/movimiento.js
document.addEventListener('DOMContentLoaded', () => {
    const movimientoForm = document.getElementById('movimiento-form');
    const selectProducto = document.getElementById('movimiento-producto');
    
    // Cargar productos en el select
    cargarProductosEnSelect();
    
    // Manejar envío del formulario de movimiento
    movimientoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productoId = selectProducto.value;
        const tipo = document.getElementById('movimiento-tipo').value;
        const cantidad = parseInt(document.getElementById('movimiento-cantidad').value);
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Debes iniciar sesión para registrar movimientos');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/movimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    producto_id: productoId,
                    tipo,
                    cantidad
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al registrar movimiento');
            }
            
            alert('Movimiento registrado exitosamente!');
            movimientoForm.reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Detalles del error:', error);
        }
    });
    
    // Función para cargar productos en el select
    async function cargarProductosEnSelect() {
        try {
            const response = await fetch('http://localhost:3000/api/productos');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const productos = await response.json();
            selectProducto.innerHTML = '<option value="">Seleccione un producto</option>';
            
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = producto.nombre;
                selectProducto.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
            alert(`Error al cargar productos: ${error.message}`);
        }
    }
    
    // Exportar para acceso desde otros módulos
    window.cargarProductosEnSelect = cargarProductosEnSelect;
});