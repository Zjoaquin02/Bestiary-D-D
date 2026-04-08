# Bestiario Arcano

Bestiario digital interactivo basado en la estética de Dungeons & Dragons, diseñado para ser consultado por Dungeon Masters y jugadores.

## 📖 Características

- **Diseño Inmersivo**: Interfaz que simula un libro antiguo con texturas de pergamino y bordes ornamentados.
- **Navegación por Categorías**: Filtra criaturas entre **Monstruos** y **Jefes (Bosses)**.
- **Vista de Ficha Detallada**: Cada criatura cuenta con su propia página con estadísticas completas, lore, vulnerabilidades, resistencias y habilidades especiales.
- **Diseño Adaptable**: Funcionalidad para alternar entre vista de **2 y 3 columnas** en escritorio.
- **Persistencia de Estado**: Recuerda el último filtro y diseño seleccionado por el usuario.

## ⚠️ Escala de Nivel de Peligro

El campo `"peligro"` en cada JSON acepta valores del **1 al 5**, reservando el **6** únicamente para casos muy extremos.

| Nivel | Ícono | Clasificación | Descripción |
|:-----:|:-----:|---------------|-------------|
| 1 | ☠️ | **Amenaza Menor** | Criatura débil. Poco riesgo para aventureros. |
| 2 | ☠️☠️ | **Amenaza Moderada** | Requiere atención y preparación básica. |
| 3 | ☠️☠️☠️ | **Amenaza Seria** | Peligrosa para grupos inexpertos. |
| 4 | ☠️☠️☠️☠️ | **Amenaza Grave** | Solo para aventureros experimentados. |
| 5 | ☠️☠️☠️☠️☠️ | **Amenaza Crítica** | Extremadamente letal. Rara de igualar. |
| 6 | ☠️☠️☠️☠️☠️☠️ | **⚡ Calamidad** | Casos **muy extremos**. Entidades míticas o apocalípticas (ej: Tarrasque, Tiamat). |

> **Nota:** El nivel 6 debe asignarse con criterio. Solo criaturas que representen una amenaza de escala catastrófica para el mundo justifican esta clasificación.

---

## 📂 Estructura del Proyecto

- `index.html`: Portada del Bestiario.
- `criatura.html`: Plantilla para la ficha detallada de cada criatura.
- `css/styles.css`: Estilos globales y diseño del libro.
- `js/app.js`: Lógica principal de la aplicación (carga de datos, renderizado).
- `data/`: Carpeta que contiene los archivos JSON con la información de las criaturas.

## 🚀 Cómo Empezar

1.  Clona el repositorio o descarga el código fuente.
2.  Asegúrate de tener una carpeta `data/` con los archivos JSON de las criaturas (ej. `goblin.json`, `dragon.json`).
3.  Abre `index.html` en tu navegador web.

## 📚 Recursos Externos

- **Fuentes**: [Google Fonts](https://fonts.google.com/)
- **Texturas**: [Transparent Textures](https://www.transparenttextures.com/)

---
*Creado con dedicación para la mesa de juego.*

# Bestiary-D-D
Bestiario

https://drive.google.com/drive/folders/1nOvrMp_12WS0SOxtbLuo-AAL7YgMV19N
Drive con libros de Dungean and Dragons varias ediciones
