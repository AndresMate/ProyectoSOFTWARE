// Función para manejar la respuesta de Google Sign-In
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    if (responsePayload.email && responsePayload.email.endsWith('@uptc.edu.co')) {
        localStorage.setItem('user', JSON.stringify({
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture
        }));
        showFlashMessage('Inicio de sesión exitoso', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showFlashMessage('Por favor, usa un correo institucional (@uptc.edu.co)', 'error');
    }
}

// Función para decodificar el token JWT de Google Sign-In
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Función para mostrar mensajes flash (éxito o error)
function showFlashMessage(message, type) {
    const flashMessages = document.getElementById('flash-messages');
    if (flashMessages) {
        flashMessages.innerHTML = `<div class="${type}">${message}</div>`;
    }
}

// Función para actualizar el nombre del usuario en el perfil
function updateProfileName() {
    const nameInput = document.getElementById('profile-name');
    const newName = nameInput.value.trim();
    if (newName) {
        const user = JSON.parse(localStorage.getItem('user'));
        user.name = newName;
        localStorage.setItem('user', JSON.stringify(user));
        showFlashMessage('Nombre actualizado correctamente', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } else {
        showFlashMessage('Por favor, ingresa un nombre válido', 'error');
    }
}

// Código principal que se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos del usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const usernameElement = document.getElementById('username');
        const userInitialElement = document.getElementById('user-initial');
        const profilePicElement = document.getElementById('profile-pic');
        const profileNameElement = document.getElementById('profile-name');
        const profileEmailElement = document.getElementById('profile-email');

        if (usernameElement) usernameElement.textContent = user.name.split(' ')[0];
        if (userInitialElement) userInitialElement.textContent = user.name.charAt(0).toUpperCase();
        if (profilePicElement) profilePicElement.src = user.picture || 'https://via.placeholder.com/100';
        if (profileNameElement) profileNameElement.value = user.name;
        if (profileEmailElement) profileEmailElement.textContent = user.email;

        // Manejar el cambio de foto de perfil
        const profilePicInput = document.getElementById('profile-pic-input');
        if (profilePicInput) {
            profilePicInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        user.picture = event.target.result;
                        localStorage.setItem('user', JSON.stringify(user));
                        profilePicElement.src = user.picture;
                        showFlashMessage('Foto de perfil actualizada', 'success');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // Manejar el cierre de sesión
    const logoutLinks = document.querySelectorAll('#logout, #mobile-logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            showFlashMessage('Sesión cerrada', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    });

    // Manejar el menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            console.log('Hamburger clicked, mobile menu toggled. Active state:', mobileMenu.classList.contains('active')); // Depuración
        });
    } else {
        console.error('Hamburger or mobile menu not found in the DOM'); // Depuración en caso de error
    }
});