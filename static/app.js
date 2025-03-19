document.addEventListener("DOMContentLoaded", function () {
    // Función para mostrar mensajes flash
    function showFlashMessage(message, category) {
        const flashContainer = document.getElementById('flash-messages');
        if (flashContainer) {
            const msg = document.createElement('div');
            msg.className = category;
            msg.textContent = message;
            flashContainer.appendChild(msg);
            setTimeout(() => msg.remove(), 3000); // Eliminar después de 3 segundos
        }
    }

    // Alternar visibilidad de contraseñas
    document.querySelectorAll(".password-group").forEach(group => {
        const passwordField = group.querySelector("input[type='password']");
        const toggle = group.querySelector(".toggle-password");
        if (passwordField && toggle) {
            toggle.addEventListener("click", function () {
                const isHidden = passwordField.type === "password";
                passwordField.type = isHidden ? "text" : "password";
                toggle.classList.toggle("fa-eye", isHidden);
                toggle.classList.toggle("fa-eye-slash", !isHidden);
            });
        }
    });

    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // Verificar sesión
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser && window.location.pathname.includes('index.html')) {
        document.getElementById('username').textContent = loggedUser.usuario;
        document.getElementById('user-initial').textContent = loggedUser.usuario[0].toUpperCase();
    } else if (!loggedUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('registro.html') && !window.location.pathname.includes('recuperar_contrasena.html') && !window.location.pathname.includes('restablecer_contrasena.html')) {
        window.location.href = 'login.html';
    }

    // Login
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = loginForm.querySelector('input[name="usuario"]').value;
            const contrasena = loginForm.querySelector('input[name="contrasena"]').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.usuario === usuario && u.contrasena === contrasena);
            if (user) {
                localStorage.setItem('loggedUser', JSON.stringify(user));
                window.location.href = 'index.html';
            } else {
                showFlashMessage('Usuario o contraseña incorrectos.', 'error');
            }
        });
    }

    // Registro
    const registroForm = document.querySelector('.registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = registroForm.querySelector('input[name="usuario"]').value;
            const email = registroForm.querySelector('input[name="email"]').value;
            const contrasena = registroForm.querySelector('input[name="contrasena"]').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showFlashMessage('El correo ya está registrado.', 'error');
            } else {
                const newUser = { usuario, email, contrasena };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('loggedUser', JSON.stringify(newUser));
                window.location.href = 'index.html';
            }
        });
    }

    // Perfil
    if (document.querySelector('.profile-container')) {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        if (user) {
            document.getElementById('profile-username').textContent = user.usuario;
            document.getElementById('profile-email').textContent = user.email;
        } else {
            window.location.href = 'login.html';
        }
    }

    // Recuperar contraseña (simulado)
    const recuperarForm = document.querySelector('#recuperar-form');
    if (recuperarForm) {
        recuperarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = recuperarForm.querySelector('input[name="email"]').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(u => u.email === email)) {
                showFlashMessage('Se ha enviado un enlace de recuperación a ' + email + ' (simulado).', 'success');
                setTimeout(() => window.location.href = 'restablecer_contrasena.html', 2000);
            } else {
                showFlashMessage('Correo no registrado.', 'error');
            }
        });
    }

    // Restablecer contraseña (simulado)
    const restablecerForm = document.querySelector('#restablecer-form');
    if (restablecerForm) {
        restablecerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nuevaContrasena = restablecerForm.querySelector('input[name="nueva_contrasena"]').value;
            const user = JSON.parse(localStorage.getItem('loggedUser'));
            if (user) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const updatedUsers = users.map(u => u.email === user.email ? { ...u, contrasena: nuevaContrasena } : u);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                localStorage.setItem('loggedUser', JSON.stringify({ ...user, contrasena: nuevaContrasena }));
                showFlashMessage('Contraseña restablecida con éxito.', 'success');
                setTimeout(() => window.location.href = 'login.html', 2000);
            } else {
                showFlashMessage('No hay sesión activa.', 'error');
            }
        });
    }

    // Logout
    document.getElementById('logout')?.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = 'login.html';
    });
    document.getElementById('mobile-logout')?.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = 'login.html';
    });
});