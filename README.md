# Bestiario Arcano

Bestiario digital interactivo basado en la estética de Dungeons & Dragons, diseñado para ser consultado por Dungeon Masters y jugadores.

## 📖 Características

- **Diseño Inmersivo**: Interfaz que simula un libro antiguo con texturas de pergamino y bordes ornamentados.
- **Navegación por Categorías**: Filtra criaturas entre **Monstruos** y **Jefes (Bosses)**.
- **Vista de Ficha Detallada**: Cada criatura cuenta con su propia página con estadísticas completas, lore, vulnerabilidades, resistencias y habilidades especiales.
- **Soporte Bilingüe (Multi-idioma)**: Traducción completa al inglés de las criaturas y la interfaz web. Incluye un script automático (`translate_data.py`) para traducir nuevas criaturas.
- **Diseño Adaptable**: Funcionalidad para alternar entre vista de **2 y 3 columnas** en escritorio.
- **Persistencia de Estado**: Recuerda el último filtro, el idioma y el diseño seleccionado por el usuario.

## ⚠️ Escala de Nivel de Peligro

El campo `"peligro"` en cada JSON acepta valores del **1 al 6**, siguiendo la jerarquía de amenaza del multiverso.

| Nivel | Ícono | Clasificación | Descripción |
|:-----:|:-----:|---------------|-------------|
| 1 | ☠️ | **Amenaza Menor** | Criatura débil. Poco riesgo para aventureros. |
| 2 | ☠️☠️ | **Amenaza Moderada** | Requiere atención y preparación básica. |
| 3 | ☠️☠️☠️ | **Amenaza Seria** | Peligrosa para grupos inexpertos. |
| 4 | ☠️☠️☠️☠️ | **Amenaza Grave** | Solo para aventureros experimentados. |
| 5 | ☠️☠️☠️☠️☠️ | **Amenaza Crítica** | Extremadamente letal. Rara de igualar. |
| 6 | ☠️☠️☠️☠️☠️☠️ | **⚡ Calamidad** | Casos **muy extremos**. Entidades míticas o apocalípticas (ej: Tarrasque, Tiamat). **Clasificados como Jefes.** |

> **Nota:** Toda criatura con nivel de Peligro 6 debe tener obligatoriamente el rol de **Jefe (boss)**.

---

## 📜 Reglas de Consistencia

Para mantener el orden, consulta el archivo [**como_crear_monstruos.txt**](file:///c:/Users/zjoaq/OneDrive/Escritorio/Bestiario/Bestiary-D-D/como_crear_monstruos.txt) para ver el tutorial paso a paso y la **Plantilla JSON** oficial.

**Resumen de normas clave:**
1. **Pureza de Grupos**: No mezcles Monstruos y Jefes en un archivo agrupado (`is_multi`).
2. **Sistema Métrico**: La velocidad se expresa siempre en **metros (m)**.
3. **Lore Enriquecido**: Evita descripciones cortas; aporta trasfondo épico.
4. **Coincidencia de IDs**: El ID debe ser idéntico en el JSON, `list.json` y el nombre de la imagen.

---

## 📂 Estructura del Proyecto

- `index.html`: Portada del Bestiario.
- `criatura.html`: Plantilla para la ficha detallada de cada criatura.
- `css/styles.css`: Estilos globales y diseño del libro.
- `js/app.js`: Lógica principal de la aplicación (carga de datos, renderizado).
- `data/`: Carpeta que contiene los archivos JSON con la información de las criaturas.
- `css/img/`: Carpeta de ilustraciones locales. Alternativamente, el campo `"imagen"` de cada JSON puede apuntar a una URL externa de [Cloudinary](https://cloudinary.com) para reducir el peso del repositorio.

  **Ejemplo con Cloudinary:**
  ```json
  "imagen": "https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/q_auto,f_auto/bestiary/criatura.webp"
  ```
  > `q_auto` optimiza la calidad automáticamente · `f_auto` elige el mejor formato según el navegador (webp/avif)

## 🚀 Cómo Empezar

1.  Clona el repositorio o descarga el código fuente.
2.  Asegúrate de tener una carpeta `data/` con los archivos JSON de las criaturas (ej. `goblin.json`, `dragon.json`).
3.  Abre `index.html` en tu navegador web.

## 📚 Recursos Externos

- **Fuentes**: [Google Fonts](https://fonts.google.com/)
- **Texturas**: [Transparent Textures](https://www.transparenttextures.com/)
- **Imágenes (CDN)**: [Cloudinary](https://cloudinary.com) — almacenamiento y optimización automática de imágenes en la nube. Plan gratuito incluye 25 GB de almacenamiento.

---
*Creado con dedicación para la mesa de juego.*

# Bestiary-D-D
Bestiario

https://drive.google.com/drive/folders/1nOvrMp_12WS0SOxtbLuo-AAL7YgMV19N
Drive con libros de Dungean and Dragons varias ediciones
