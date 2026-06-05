const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

if (!token || !usuarioGuardado) {
  window.location.href = "login.html";
}

const usuario = JSON.parse(usuarioGuardado);

if (usuario.rol !== "admin") {
  alert("Solo el administrador puede entrar a esta pagina");
  window.location.href = "libros.html";
}

const tablaUsuarios = document.getElementById("tabla-usuarios");
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

async function cargarUsuarios() {
  try {
    const respuesta = await fetch("/usuarios", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || datos.error || "Error al cargar usuarios");
    }

    mostrarUsuarios(datos.usuarios);
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function mostrarUsuarios(usuarios) {
  tablaUsuarios.innerHTML = "";

  if (usuarios.length === 0) {
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="6">No hay usuarios registrados</td>
      </tr>
    `;
    return;
  }

  usuarios.forEach((user) => {
    const fila = `
      <tr>
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.rol}</td>
        <td>${user.createdAt || "-"}</td>
        <td>
          <button class="btn-amarillo" onclick="editarUsuario(${user.id}, '${user.nombre}', '${user.email}', '${user.rol}')">Editar</button>
          <button class="btn-rojo" onclick="eliminarUsuario(${user.id})">Eliminar</button>
        </td>
      </tr>
    `;

    tablaUsuarios.innerHTML += fila;
  });
}

async function editarUsuario(id, nombreActual, emailActual, rolActual) {
  const nuevoNombre = prompt("Nuevo nombre:", nombreActual);
  const nuevoEmail = prompt("Nuevo email:", emailActual);
  const nuevoRol = prompt("Nuevo rol: admin o usuario", rolActual);

  if (!nuevoNombre || !nuevoEmail || !nuevoRol) {
    mostrarMensaje("Edicion cancelada", "error");
    return;
  }

  if (nuevoRol !== "admin" && nuevoRol !== "usuario") {
    mostrarMensaje("Rol no valido. Use admin o usuario", "error");
    return;
  }

  try {
    const respuesta = await fetch(`/usuarios/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        email: nuevoEmail,
        rol: nuevoRol,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || datos.error || "Error al actualizar usuario");
    }

    mostrarMensaje("Usuario actualizado correctamente", "ok");
    cargarUsuarios();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function eliminarUsuario(id) {
  if (id === usuario.id) {
    mostrarMensaje("No puedes eliminar tu propio usuario mientras estas logueado", "error");
    return;
  }

  const confirmar = confirm("¿Seguro que deseas eliminar este usuario?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || datos.error || "Error al eliminar usuario");
    }

    mostrarMensaje("Usuario eliminado correctamente", "ok");
    cargarUsuarios();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

cargarUsuarios();