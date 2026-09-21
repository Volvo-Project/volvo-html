// Muestra el detalle del producto según el ?id= de la URL
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get("id");

  const producto = productos.find(p => p.id === idProducto);

  if (!producto) {
    mostrarProducto(productos[0]);
    return;
  }

  mostrarProducto(producto);
});

function mostrarProducto(producto) {
  document.title = `Volvo | ${producto.nombre}`;
  document.getElementById("prod-titulo-heading").textContent = producto.nombre;
  document.getElementById("prod-breadcrumb").textContent = producto.nombre;
  document.getElementById("prod-imagen").src = producto.imagenDetalle;
  document.getElementById("prod-imagen").alt = `Portada de ${producto.nombre}`;
  document.getElementById("prod-descripcion").textContent = producto.descripcion;
  document.getElementById("prod-id").textContent = producto.idJuego;
  document.getElementById("prod-genero").textContent = producto.genero;
  document.getElementById("prod-etiquetas").textContent = producto.etiquetas;

  const precioEl = document.getElementById("prod-precio");
  precioEl.textContent = producto.esGratis
    ? "Gratis"
    : `$${producto.precio.toLocaleString("es-CL")}`;

  // Los productos sin trailer cargado esconden la sección completa,
  // si no el iframe se quedaría con un src vacío.
  const trailerEl = document.getElementById("prod-trailer");
  const seccionTrailer = document.getElementById("seccion-trailer");
  if (trailerEl && producto.trailer) {
    trailerEl.src = `${producto.trailer}?autoplay=1&mute=1`;
    trailerEl.title = `Tráiler de ${producto.nombre}`;
    if (seccionTrailer) {
      seccionTrailer.hidden = false;
    }
  } else if (seccionTrailer) {
    seccionTrailer.hidden = true;
  }

  mostrarOpiniones(producto);

  // Deja el producto activo disponible globalmente para que carrito.js lo use
  window.productoActual = producto;
}

// Dibuja las opiniones del producto en la pestaña "Opiniones"
function mostrarOpiniones(producto) {
  const contenedor = document.getElementById("reviews");
  const pestana = document.getElementById("reviews-tab");
  if (!contenedor) {
    return;
  }

  const opiniones = producto.opiniones || [];

  if (pestana) {
    pestana.textContent = `Opiniones (${opiniones.length})`;
  }

  if (opiniones.length === 0) {
    contenedor.innerHTML = "<p class=\"mb-0\">Este producto todavía no tiene opiniones.</p>";
    return;
  }

  contenedor.innerHTML = '<div class="list-group list-group-flush">' + opiniones.map((opinion) => {
    // Cinco estrellas siempre: las llenas segun la nota y el resto vacias
    const estrellas = "★".repeat(opinion.nota) + "☆".repeat(5 - opinion.nota);
    return `
      <article class="list-group-item">
        <div class="d-flex justify-content-between">
          <h3 class="h6 mb-1">${opinion.autor}</h3>
          <span class="text-warning" aria-label="${opinion.nota} de 5 estrellas">${estrellas}</span>
        </div>
        <p class="mb-0">${opinion.texto}</p>
      </article>
    `;
  }).join("") + '</div>';
}
