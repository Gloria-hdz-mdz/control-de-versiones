// frontend/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                // En un sistema real, esto sería una petición a tu API
                const token = btoa(JSON.stringify({
                    id: "user_" + Date.now(),
                    nombre: username
                }));
                
                localStorage.setItem('token', token);
                window.location.href = 'inventario.html';
            } catch (error) {
                alert('Error de autenticación: ' + error.message);
            }
        });
    }
    
    // Manejar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        });
    }
    
    // Verificar autenticación en páginas protegidas
    const protectedPages = ['inventario.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        
        try {
            // En un sistema real, verificarías el token con tu backend
            const userData = JSON.parse(atob(token));
            console.log('Usuario autenticado:', userData);
        } catch (error) {
            console.error('Token inválido:', error);
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    }
});