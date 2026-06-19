# GAME GALAXY 🎮🌌

Aplicación móvil híbrida desarrollada con **Capacitor + p5.js** para la asignatura de **Desarrollo de Aplicaciones Interactivas (PR2)**.

La aplicación representa los videojuegos mejor valorados mediante una galaxia interactiva donde cada planeta simboliza un juego. Los datos se obtienen dinámicamente desde una API externa y se visualizan dentro de un entorno espacial animado.

---

# 📱 Características

- Aplicación híbrida desarrollada con Capacitor.
- Canvas interactivo creado con p5.js.
- Fondo espacial animado con estrellas en movimiento.
- Planetas flotantes que representan videojuegos.
- Consulta dinámica de datos mediante la API RAWG.
- Información del videojuego al seleccionar un planeta.
- Vibración nativa mediante Capacitor Haptics.
- Reproducción de sonido al interactuar.
- Panel de configuración integrado en la interfaz.
- Persistencia de preferencias mediante LocalStorage.
- Ajuste dinámico del tamaño de los planetas.
- Posibilidad de activar o desactivar las estrellas.
- Diseño responsive adaptado a dispositivos móviles.
- Compilación y ejecución en Android Studio.
- Sistema de fallback con datos locales en caso de fallo de la API.

---

# 🛠️ Tecnologías utilizadas

- JavaScript
- ViteJS
- p5.js
- Capacitor
- Capacitor Haptics
- LocalStorage
- Android Studio
- RAWG Video Games Database API

---

# 🎮 Funcionamiento

Al iniciar la aplicación:

1. Se consulta la API RAWG para obtener videojuegos populares.
2. Cada videojuego se representa como un planeta dentro de la galaxia.
3. El usuario puede pulsar cualquier planeta para visualizar información detallada.
4. La interacción genera una vibración mediante funcionalidades nativas del dispositivo.
5. Si la API no responde, se muestran automáticamente datos locales para garantizar el funcionamiento de la aplicación.

---

# ⚙️ Personalización

La aplicación incluye un menú de configuración accesible mediante el botón ⚙️.

Opciones disponibles:

- Mostrar/Ocultar estrellas del fondo.
- Ajustar el tamaño de los planetas.
- Guardado automático de preferencias mediante LocalStorage.

Las configuraciones permanecen almacenadas entre sesiones.

---
