// Archivo service-worker.js

// Instalación del Service Worker
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('my-cache').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/service-worker.js'
        // Agrega otras rutas que quieres cachear
      ]);
    })
  );
});

// Activación del Service Worker
self.addEventListener('activate', function (event) {
  // Limpia cachés antiguos
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== 'my-cache') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepción de solicitudes y manejo de caché
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

document.addEventListener('DOMContentLoaded', function () {
  const nameForm = document.getElementById('nameForm');
  const welcomeMessage = document.getElementById('welcomeMessage');

  // Verifica si ya hay un nombre guardado en el almacenamiento local
  const storedName = localStorage.getItem('userName');
  if (storedName) {
    welcomeMessage.textContent = `¡Bienvenido de nuevo, ${storedName}!`;
  }

  // Agrega un evento al formulario para guardar el nombre
  nameForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtiene el nombre ingresado por el usuario
    const userName = document.getElementById('name').value;

    // Guarda el nombre en el almacenamiento local
    localStorage.setItem('userName', userName);

    // Muestra un mensaje de bienvenida
    welcomeMessage.textContent = `¡Hola, ${userName}!`;
  });
});
