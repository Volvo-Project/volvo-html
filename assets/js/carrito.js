function obtenerCarrito() {
    const datos = localStorage.getItem("carrito");

    if (datos === null) {
        return [];

    } else {
        return JSON.parse(datos)
    }
}

function guardarCarrito(carrito) {
    const item = JSON.stringify(carrito);
    localStorage.setItem("carrito", item)
}

function formatearPrecio(numero) {
    return `$${numero.toLocaleString('es-CL')}`;
}

function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const existe = carrito.find(item => item.id === producto.id);

    if (existe !== undefined) {
        existe.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }


    guardarCarrito(carrito);
}
const formQty = document.querySelector('#qty');

if (formQty) {
    formQty.addEventListener("submit", (e) => {
        e.preventDefault();
        const cantidad = Number(document.querySelector('#cantidad').value);
        if (isNaN(cantidad) || cantidad <= 0 ||
            !Number.isInteger(cantidad)) {
            aviso.className = "alert alert-danger";
            aviso.textContent = "Ingresa una cantidad válida (número entero mayor a 0)";
            aviso.hidden = false;
            return;
        }
        // window.productoActual lo define detalle.js según el juego que se está viendo
        if (!window.productoActual) {
            return;
        }
        const producto = {
            id: window.productoActual.id,
            nombre: window.productoActual.nombre,
            precio: window.productoActual.precio,
            imagen: window.productoActual.imagen,
            cantidad: cantidad
        };
        agregarAlCarrito(producto);
        aviso.className = "alert alert-success";
        aviso.textContent = "Producto agregado al carrito";
        aviso.hidden = false;
        actualizarContadorCarrito();
    });
}

function renderizarCarrito() {
    const cuerpo = document.querySelector('#carrito-cuerpo');
    const carrito = obtenerCarrito();
    cuerpo.innerHTML = "";

    const botonVaciar = document.querySelector('#vaciar-carrito');
    const botonFinalizar = document.querySelector('#finalizar-compra');

    if (carrito.length === 0) {
        cuerpo.innerHTML = `<div class="list-group-item text-center py-4">Tu carrito está vacío. <a href="producto.html">Ver catálogo</a></div>`;
        if (botonVaciar) botonVaciar.disabled = true;
        if (botonFinalizar) botonFinalizar.disabled = true;
        document.querySelector('#carrito-total').textContent = formatearPrecio(0);
        actualizarContadorCarrito();
        return;
    }

    if (botonVaciar) botonVaciar.disabled = false;
    if (botonFinalizar) botonFinalizar.disabled = false;

    let total = 0;

    carrito.forEach((item) => {
        const subtotal = (item.precio * item.cantidad)
        total += subtotal

        const miniatura = item.imagen
            ? `<img src="${item.imagen}" class="object-fit-cover" alt="Portada de ${item.nombre}">`
            : `<div class="bg-secondary-subtle d-flex align-items-center justify-content-center">Sin imagen</div>`;

        const fila = document.createElement('div');
        fila.className = 'list-group-item';
        fila.innerHTML = `
      <div class="row align-items-center g-3">
        <div class="col-4 col-md-2">
          <div class="ratio ratio-1x1 rounded overflow-hidden">${miniatura}</div>
        </div>
        <div class="col-8 col-md-6">
          <h3 class="h6">${item.nombre}</h3>
          <div class="btn-group btn-group-sm mb-2" role="group" aria-label="Cantidad de ${item.nombre}">
            <button type="button" class="btn btn-outline-secondary btn-restar" data-id="${item.id}" aria-label="Restar una unidad de ${item.nombre}">−</button>
            <span class="btn btn-light disabled">${item.cantidad}</span>
            <button type="button" class="btn btn-outline-secondary btn-sumar" data-id="${item.id}" aria-label="Sumar una unidad de ${item.nombre}">+</button>
          </div>
          <div>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${item.id}" aria-label="Eliminar ${item.nombre} del carrito">Eliminar</button>
          </div>
        </div>
        <div class="col-12 col-md-4 text-md-end">
          <strong class="d-block">${formatearPrecio(subtotal)}</strong>
          <span class="text-body-secondary small">${formatearPrecio(item.precio)} c/u</span>
        </div>
      </div>
    `;
        cuerpo.appendChild(fila);
    });

    document.querySelector('#carrito-total').textContent = formatearPrecio(total);
    actualizarContadorCarrito();
}
const cuerpoCarrito = document.querySelector('#carrito-cuerpo');


function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito();
    const carritoFiltrado = carrito.filter(item => item.id !== id)
    guardarCarrito(carritoFiltrado);
    renderizarCarrito();
}
if (cuerpoCarrito) {
    renderizarCarrito();

    cuerpoCarrito.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.dataset.id;
            const carrito = obtenerCarrito();
            const item = carrito.find(item => item.id === id);
            const nombre = item ? item.nombre : "este producto";
            if (window.confirm(`¿Eliminar ${nombre} del carrito?`)) {
                eliminarDelCarrito(id);
            }
        } else if (e.target.classList.contains('btn-sumar')) {
            const id = e.target.dataset.id;
            const carrito = obtenerCarrito();
            const item = carrito.find(item => item.id === id);
            actualizarCantidad(id, item.cantidad + 1);
        } else if (e.target.classList.contains('btn-restar')) {
            const id = e.target.dataset.id;
            const carrito = obtenerCarrito();
            const item = carrito.find(item => item.id === id);
            if (item.cantidad > 1) {
                actualizarCantidad(id, item.cantidad - 1);
            }
        }
    });
    
}


const botonVaciar = document.querySelector('#vaciar-carrito');

if (botonVaciar) {
    botonVaciar.addEventListener('click', () => {
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            return;
        }
        if (window.confirm("¿Vaciar todo el carrito? Esta acción no se puede deshacer.")) {
            guardarCarrito([]);
            renderizarCarrito();
        }
    });
}
function actualizarCantidad(id, nuevaCantidad) {
    const carrito = obtenerCarrito();
    const item = carrito.find(item => item.id === id)

    if (item !== undefined) {
        item.cantidad = nuevaCantidad
    }


    guardarCarrito(carrito);
    renderizarCarrito();
}
const botonFinalizar = document.querySelector('#finalizar-compra');
const aviso = document.querySelector('#aviso');

if (botonFinalizar) {
    botonFinalizar.addEventListener('click', () => {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        aviso.className = "alert alert-danger mt-3 mb-0";
        aviso.textContent = "No tiene productos para comprar"
        aviso.hidden = false
        return
    }

    if (!localStorage.getItem("usuarioSesion")) {
        localStorage.setItem("volverDespuesDeLogin", "carrito.html");
        window.location.href = "login.html";
        return;
    }

    guardarCarrito([]);
    renderizarCarrito();
    aviso.className = "alert alert-success mt-3 mb-0";
    aviso.textContent = "Gracias por tu compra";
    aviso.hidden = false
});
}