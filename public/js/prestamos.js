const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

if (!token || !usuarioGuardado) {
  window.location.href = "login.html";
}

const usuario = JSON.parse(usuarioGuardado);

const tablaPrestamos = document.getElementById("tabla-prestamos");
const mensaje = document.getElementById("mensaje");
const datosUsuario = document.getElementById("datos-usuario");

datosUsuario.textContent = `Usuario: ${usuario.nombre} | Rol: ${usuario.rol}`;

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}

async function cargarPrestamos() {
  try {
    const respuesta = await fetch("/prestamos", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al cargar prestamos");
    }

    mostrarPrestamos(datos.prestamos);
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function mostrarPrestamos(prestamos) {
  tablaPrestamos.innerHTML = "";

  if (prestamos.length === 0) {
    tablaPrestamos.innerHTML = `
      <tr>
        <td colspan="8">No hay prestamos registrados</td>
      </tr>
    `;
    return;
  }

  prestamos.forEach((prestamo) => {
    const nombreUsuario = prestamo.Usuario ? prestamo.Usuario.nombre : "Sin usuario";
    const tituloLibro = prestamo.Libro ? prestamo.Libro.titulo : "Sin libro";

    let acciones = "";

    if (usuario.rol === "admin") {
      if (prestamo.estado === "pendiente") {
        acciones += `
          <button class="btn-verde" onclick="aprobarPrestamo(${prestamo.id})">Aprobar</button>
        `;
      }

      if (prestamo.estado === "prestado") {
        acciones += `
          <button class="btn-amarillo" onclick="devolverPrestamo(${prestamo.id})">Devolver</button>
        `;
      }
    }

    if (acciones === "") {
      acciones = "Sin acciones";
    }

    const claseEstado = "estado-" + prestamo.estado;

    const fila = `
      <tr>
        <td>${prestamo.id}</td>
        <td>${prestamo.codigo}</td>
        <td>${nombreUsuario}</td>
        <td>${tituloLibro}</td>
        <td>${prestamo.fecha_prestamo}</td>
        <td>${prestamo.fecha_devolucion || "-"}</td>
        <td class="${claseEstado}">${prestamo.estado}</td>
        <td>${acciones}</td>
      </tr>
    `;

    tablaPrestamos.innerHTML += fila;
  });
}

async function aprobarPrestamo(id) {
  const confirmar = confirm("¿Deseas aprobar este prestamo?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`/prestamos/${id}/aprobar`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al aprobar prestamo");
    }

    mostrarMensaje("Prestamo aprobado correctamente", "ok");
    cargarPrestamos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function devolverPrestamo(id) {
  const confirmar = confirm("¿Deseas registrar la devolucion?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`/prestamos/${id}/devolver`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al registrar devolucion");
    }

    mostrarMensaje("Devolucion registrada correctamente", "ok");
    cargarPrestamos();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

cargarPrestamos();