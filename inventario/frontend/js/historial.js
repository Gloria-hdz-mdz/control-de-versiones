// frontend/js/historial.js
document.addEventListener('DOMContentLoaded', () => {
    const filterProducto = document.getElementById('filter-producto');
    const historicoList = document.getElementById('historico-list');
    const token = localStorage.getItem('token');
    
    // Cargar productos para el filtro
    cargarProductosParaFiltro();
    
    // Cargar histórico
    cargarHistorico();
    
    // Filtrar histórico por producto
    if (filterProducto) {
        filterProducto.addEventListener('change', cargarHistorico);
    }
    
    // Función para cargar productos en el filtro
    async function cargarProductosParaFiltro() {
        if (!filterProducto) return;
        
        try {
            const response = await fetch('http://localhost:3000/api/productos');
            if (!response.ok) throw new Error('Error al cargar productos');
            
            const productos = await response.json();
            
            // Limpiar select
            filterProducto.innerHTML = '';
            
            // Opción "Todos los productos"
            const optionTodos = document.createElement('option');
            optionTodos.value = 'todos';
            optionTodos.textContent = 'Todos los productos';
            filterProducto.appendChild(optionTodos);
            
            // Opciones de productos
            productos.forEach(producto => {
                const option = document.createElement('option');
                option.value = producto._id;
                option.textContent = producto.nombre;
                filterProducto.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }
    
    // Función para cargar el histórico
    async function cargarHistorico() {
        if (!historicoList) return;
        
        const productoId = filterProducto ? filterProducto.value : 'todos';
        
        try {
            let url;
            if (productoId === 'todos') {
                url = 'http://localhost:3000/api/movimientos/historial';
            } else {
                url = `http://localhost:3000/api/productos/${productoId}/historial`;
            }
            
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al cargar histórico');
            }
            
            const movimientos = await response.json();
            renderizarHistorial(movimientos);
        } catch (error) {
            console.error('Error al cargar histórico:', error);
            historicoList.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }
    
    // Función para renderizar el historial
    function renderizarHistorial(movimientos) {
        if (!historicoList) return;
        
        historicoList.innerHTML = '';
        
        if (!movimientos || movimientos.length === 0) {
            historicoList.innerHTML = '<p>No hay movimientos para mostrar.</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'table table-striped';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        
        const tbody = table.querySelector('tbody');
        
        movimientos.forEach(movimiento => {
            const row = document.createElement('tr');
            
            // Obtener nombre de producto
            let nombreProducto = 'Producto eliminado';
            if (movimiento.producto_id && typeof movimiento.producto_id === 'object') {
                nombreProducto = movimiento.producto_id.nombre;
            } else if (movimiento.producto_id) {
                nombreProducto = movimiento.producto_id;
            }
            
            // Obtener nombre de usuario
            let nombreUsuario = 'Usuario eliminado';
            if (movimiento.usuario_id && typeof movimiento.usuario_id === 'object') {
                nombreUsuario = movimiento.usuario_id.nombre;
            } else if (movimiento.usuario_id) {
                nombreUsuario = movimiento.usuario_id;
            }
            
            row.innerHTML = `
                <td>${new Date(movimiento.fecha).toLocaleString()}</td>
                <td>${nombreProducto}</td>
                <td class="${movimiento.tipo === 'entrada' ? 'text-success' : 'text-danger'}">
                    ${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                </td>
                <td>${movimiento.cantidad}</td>
                <td>${nombreUsuario}</td>
            `;
            
            tbody.appendChild(row);
        });
        
        historicoList.appendChild(table);
    }
});