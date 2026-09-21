function obtenerSesion() {
    try {
        return JSON.parse(localStorage.getItem('usuarioSesion') || 'null');
    } catch (error) {
        return null;
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioSesion');
    window.location.href = 'index.html';
}

function actualizarNavegacionSesion() {
    const sesion = obtenerSesion();
    const enlacesSesion = document.querySelectorAll('a[href="login.html"].nav-link');

    if (!sesion) {
        return;
    }

    // Con sesión iniciada, "Registrarse" ya no tiene sentido: se oculta
    document.querySelectorAll('a[href="registro.html"].nav-link').forEach((enlace) => {
        const item = enlace.closest('li');
        if (item) {
            item.hidden = true;
        }
    });

    enlacesSesion.forEach((enlace) => {
        const contenedor = enlace.closest('li');

        // Si la sesión es de administrador, agrega el enlace al panel antes de la cuenta
        if (sesion.rol === 'Administrador') {
            const itemAdmin = document.createElement('li');
            itemAdmin.className = 'nav-item';
            itemAdmin.innerHTML = '<a class="nav-link" href="admin/home.html">Panel</a>';
            contenedor.parentNode.insertBefore(itemAdmin, contenedor);
        }

        // El nombre de la cuenta pasa a ser un menú desplegable de Bootstrap con la opción de cerrar sesión
        contenedor.classList.add('dropdown');
        enlace.textContent = sesion.nombre || sesion.correo;
        enlace.href = '#';
        enlace.id = 'cuentaSesion';
        enlace.classList.add('dropdown-toggle');
        enlace.setAttribute('aria-haspopup', 'true');
        enlace.setAttribute('aria-expanded', 'false');

        const menu = document.createElement('ul');
        menu.className = 'dropdown-menu dropdown-menu-end';
        menu.innerHTML = '<li><button type="button" class="dropdown-item" id="cerrarSesion">Cerrar sesión</button></li>';
        contenedor.appendChild(menu);

        enlace.addEventListener('click', (event) => {
            event.preventDefault();
            const abierto = menu.classList.toggle('show');
            enlace.setAttribute('aria-expanded', String(abierto));
        });

        document.addEventListener('click', (event) => {
            if (!contenedor.contains(event.target)) {
                menu.classList.remove('show');
                enlace.setAttribute('aria-expanded', 'false');
            }
        });

        menu.querySelector('#cerrarSesion').addEventListener('click', cerrarSesion);
    });
}

document.addEventListener('DOMContentLoaded', actualizarNavegacionSesion);
