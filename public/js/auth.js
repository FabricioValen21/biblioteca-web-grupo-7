const URL_BASE = '/auth';

const formIngreso = document.getElementById('formulario-ingreso');
const formRegistro = document.getElementById('formulario-registro');
const cajaMensajes = document.getElementById('caja-mensajes');

function verAlerta(mensaje, esBueno = false) {
    if (!cajaMensajes) return;
    cajaMensajes.textContent = mensaje;
    cajaMensajes.style.display = 'block';
    if (esBueno) {
        cajaMensajes.className = 'alerta alerta-buena';
    } else {
        cajaMensajes.className = 'alerta alerta-mala';
    }
}

if (formIngreso) {
    formIngreso.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('clave').value;

        try {
            const respuesta = await fetch(`${URL_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const datos = await respuesta.json();

            if (!respuesta.ok) throw new Error(datos.mensaje || 'Fallo el ingreso');
            
            verAlerta('Ingreso correcto. Entrando...', true);
            setTimeout(() => { window.location.href = 'libros.html'; }, 1500);
        } catch (error) {
            verAlerta(error.message);
        }
    });
}

if (formRegistro) {
    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('clave').value;

        try {
            const respuesta = await fetch(`${URL_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password })
            });
            const datos = await respuesta.json();

            if (!respuesta.ok) throw new Error(datos.mensaje || 'Fallo el registro');
            
            verAlerta('Registro listo. Ve a iniciar sesion', true);
            setTimeout(() => { window.location.href = 'login.html'; }, 2000);
        } catch (error) {
            verAlerta(error.message);
        }
    });
}