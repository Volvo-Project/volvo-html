// Barra de navegación: le agrega una sombra cuando el usuario baja la página
const barraNavegacion = document.querySelector('.navbar');
if (barraNavegacion) {
    window.addEventListener('scroll', () => {
        barraNavegacion.classList.toggle('shadow', window.scrollY > 10);
    });
}

// Newsletter del inicio: valida el correo con una expresión regular
const formSubscribe = document.querySelector('#subscribe');
if (formSubscribe) {
    formSubscribe.addEventListener('submit', function (e) {
        e.preventDefault();
        const avisoSubscribe = document.querySelector('#subscribe-aviso');
        const inputEmail = document.querySelector('#exampleInputEmail1');
        const correo = inputEmail.value.trim();
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!correoValido) {
            avisoSubscribe.className = "alert alert-danger mt-3 mb-0";
            avisoSubscribe.textContent = "Ingresa un correo electrónico válido";
            avisoSubscribe.hidden = false;
            return;
        }

        avisoSubscribe.className = "alert alert-success mt-3 mb-0";
        avisoSubscribe.textContent = "¡Listo! Te suscribiste con " + correo + ". Revisa tu correo por el descuento.";
        avisoSubscribe.hidden = false;
        formSubscribe.reset();
    });
}

// Contador del carrito (insignia junto al enlace "Carrito")
function actualizarContadorCarrito() {
    const contador = document.querySelector('#carrito-contador');
    if (!contador) {
        return;
    }
    let carrito = [];
    try {
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    } catch (e) {
        carrito = [];
    }
    const totalUnidades = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    if (totalUnidades > 0) {
        contador.textContent = totalUnidades;
        contador.hidden = false;
    } else {
        contador.hidden = true;
    }
}
actualizarContadorCarrito();

// Juegos que rota la tarjeta destacada del inicio. El precio y el enlace deben coincidir
// con lo que tiene el mismo juego en el arreglo de productos.js.
const juegosBanner = [
    {
        tarjeta: "assets/images/assassinscreed2.jpg",
        nombre: "Assassin's Creed",
        enlace: "detalle-producto.html?id=assassins-creed",
        precio: "$19.990",
        oferta: "-50%"
    },
    {
        tarjeta: "assets/images/warframe-portada.jpg",
        nombre: "Warframe",
        enlace: "detalle-producto.html?id=warframe",
        precio: "GRATIS",
        oferta: ""
    }
];

let indiceActual = 0;

function cambiarBanner() {
    const tarjeta = document.querySelector('#banner-tarjeta');
    if (!tarjeta) {
        return;
    }
    const imgTarjeta = document.querySelector('#banner-img');
    const enlaceTarjeta = document.querySelector('#banner-enlace');
    const txtPrecio = document.querySelector('#banner-precio');
    const txtOferta = document.querySelector('#banner-oferta');

    // "fade" de Bootstrap: se quita "show" para que se desvanezca y se vuelve a poner al cambiar el contenido
    tarjeta.classList.remove('show');

    setTimeout(() => {
        indiceActual = (indiceActual + 1) % juegosBanner.length;
        const juego = juegosBanner[indiceActual];

        imgTarjeta.src = juego.tarjeta;
        imgTarjeta.alt = `Portada de ${juego.nombre}`;
        // El enlace tambien cambia, si no la portada llevaria siempre al mismo juego
        enlaceTarjeta.href = juego.enlace;
        txtPrecio.textContent = juego.precio;
        txtOferta.textContent = juego.oferta;
        txtOferta.hidden = juego.oferta === "";

        tarjeta.classList.add('show');
    }, 300);
}

if (document.querySelector('#banner-tarjeta')) {
    setInterval(cambiarBanner, 10000);
}
