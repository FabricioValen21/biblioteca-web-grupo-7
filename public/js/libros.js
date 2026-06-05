const token = localStorage.getItem("token");
const usuarioGuardado = localStorage.getItem("usuario");

if (!token || !usuarioGuardado) {
  window.location.href = "login.html";
}

const usuario = JSON.parse(usuarioGuardado);

const tablaLibros = document.getElementById("tabla-libros");
const mensaje = document.getElementById("mensaje");
const panelAdmin = document.getElementById("panel-admin");
const datosUsuario = document.getElementById("datos-usuario");

datosUsuario.textContent = `Usuario: ${usuario.nombre} | Rol: ${usuario.rol}`;

if (usuario.rol === "admin") {
  panelAdmin.classList.remove("oculto");
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
  mensaje.style.display = "block";

  setTimeout(() => {
    mensaje.style.display = "none";
  }, 3000);
}

async function cargarLibros() {
  try {
    const respuesta = await fetch("/libros");
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al cargar libros");
    }

    mostrarLibros(datos.libros);
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function mostrarLibros(libros) {
  tablaLibros.innerHTML = "";

  if (libros.length === 0) {
    tablaLibros.innerHTML = `
      <tr>
        <td colspan="6">No se encontraron libros</td>
      </tr>
    `;
    return;
  }

  libros.forEach((libro) => {
    let botonesAdmin = "";

    if (usuario.rol === "admin") {
      botonesAdmin = `
        <button class="btn-amarillo" onclick="editarLibro(${libro.id})">Editar</button>
        <button class="btn-rojo" onclick="eliminarLibro(${libro.id})">Eliminar</button>
      `;
    }

    const fila = `
      <tr>
        <td>${libro.id}</td>
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.categoria}</td>
        <td>${libro.cantidad}</td>
        <td>
          <div class="acciones">
            <button class="btn-verde" onclick="solicitarPrestamo(${libro.id})">Solicitar</button>
            ${botonesAdmin}
          </div>
        </td>
      </tr>
    `;

    tablaLibros.innerHTML += fila;
  });
}

async function buscarLibros() {
  const titulo = document.getElementById("buscar-titulo").value;

  try {
    const respuesta = await fetch(`/libros?titulo=${titulo}`);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al buscar libros");
    }

    mostrarLibros(datos.libros);
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function crearLibro() {
  const titulo = document.getElementById("titulo").value;
  const autor = document.getElementById("autor").value;
  const categoria = document.getElementById("categoria").value;
  const cantidad = document.getElementById("cantidad").value;

  if (!titulo || !autor || !categoria || cantidad === "") {
    mostrarMensaje("Completa todos los campos", "error");
    return;
  }

  try {
    const respuesta = await fetch("/libros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        titulo: titulo,
        autor: autor,
        categoria: categoria,
        cantidad: Number(cantidad),
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al crear libro");
    }

    mostrarMensaje("Libro creado correctamente", "ok");

    document.getElementById("titulo").value = "";
    document.getElementById("autor").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("cantidad").value = "";

    cargarLibros();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function editarLibro(id) {
  const nuevoTitulo = prompt("Nuevo titulo:");
  const nuevoAutor = prompt("Nuevo autor:");
  const nuevaCategoria = prompt("Nueva categoria:");
  const nuevaCantidad = prompt("Nueva cantidad:");

  if (!nuevoTitulo || !nuevoAutor || !nuevaCategoria || nuevaCantidad === null) {
    mostrarMensaje("Edicion cancelada", "error");
    return;
  }

  try {
    const respuesta = await fetch(`/libros/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        titulo: nuevoTitulo,
        autor: nuevoAutor,
        categoria: nuevaCategoria,
        cantidad: Number(nuevaCantidad),
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al editar libro");
    }

    mostrarMensaje("Libro actualizado correctamente", "ok");
    cargarLibros();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function eliminarLibro(id) {
  const confirmar = confirm("¿Seguro que deseas eliminar este libro?");

  if (!confirmar) {
    return;
  }

  try {
    const respuesta = await fetch(`/libros/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al eliminar libro");
    }

    mostrarMensaje("Libro eliminado correctamente", "ok");
    cargarLibros();
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

async function solicitarPrestamo(libroId) {
  try {
    const respuesta = await fetch("/prestamos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        libro_id: libroId,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || "Error al solicitar prestamo");
    }

    mostrarMensaje("Prestamo solicitado correctamente", "ok");
  } catch (error) {
    mostrarMensaje(error.message, "error");
  }
}

function cerrarSesion() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
}

cargarLibros();