/**
 * BESTIARIO ARCANO - Lógica de Aplicación
 * Organización profesional por sectores
 */

/* ============================================================
   1. VARIABLES Y CONFIGURACIÓN
   ============================================================ */
let allCreatures = [];
const DATA_PATH = 'data/';
const LIST_FILE = 'data/list.json';

/* ============================================================
   2. SERVICIOS DE DATOS (API / FETCH)
   ============================================================ */

/**
 * Carga la lista principal de criaturas
 */
async function loadList() {
    try {
        const res = await fetch(LIST_FILE);
        if (!res.ok) throw new Error('No se pudo cargar el índice del bestiario');
        
        allCreatures = await res.json();

        // Recuperar el último filtro usado o por defecto 'monster'
        const lastFilter = localStorage.getItem('bestiaryFilter') || 'monster';
        filterType(lastFilter);
    } catch (error) {
        console.error('Error:', error);
        renderErrorMessage('El índice de criaturas ha sido borrado por el Vacío. Inténtalo más tarde.');
    }
}

/**
 * Carga los detalles de una criatura específica
 */
async function loadCreature() {
    try {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (!id) return;

        const res = await fetch(`${DATA_PATH}${id}.json`);
        if (!res.ok) throw new Error('Criatura no encontrada en los registros');
        
        const c = await res.json();
        renderCreatureDetail(c);
        renderAnnotations(id); // Cargar las notas personalizadas
    } catch (error) {
        console.error('Error:', error);
        renderCreatureError();
    }
}

/* ============================================================
   3. RENDERIZADO DE IU (MANIPULACIÓN DEL DOM)
   ============================================================ */

/**
 * Filtra y renderiza las tarjetas de criaturas en el grid
 */
function filterType(type) {
    const grid = document.getElementById('grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Guardar la elección
    localStorage.setItem('bestiaryFilter', type);

    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (type === 'monster') document.getElementById('btn-monsters')?.classList.add('active');
    if (type === 'boss') document.getElementById('btn-bosses')?.classList.add('active');

    // Cambiar tema visual si es un jefe
    if (type === 'boss') {
        document.body.classList.add('boss-mode');
    } else {
        document.body.classList.remove('boss-mode');
    }

    const filtered = allCreatures.filter(c => c.tipo === type);

    filtered.forEach(c => {
        const article = document.createElement('article'); // Semántica: article para tarjetas
        article.className = 'card' + (type === 'boss' ? ' boss-card' : '');
        article.innerHTML = `<h3>${c.nombre}</h3>`;
        article.onclick = () => location.href = `criatura.html?id=${c.id}`;
        grid.appendChild(article);
    });

    applySavedLayout();
}

/**
 * Inyecta los datos de la criatura en la página de detalles
 */
function renderCreatureDetail(c) {
    if (c.rol === 'boss') {
        document.body.classList.add('boss-mode');
        document.getElementById('cursed-seal')?.classList.remove('seal-hidden');
        document.getElementById('cursed-seal')?.classList.add('void-seal');
    }

    const dangerLvl = document.getElementById('danger-level');
    if (dangerLvl) {
        const skulls = "☠️".repeat(c.peligro || 1);
        dangerLvl.innerHTML = `Nivel de Peligro: ${skulls}`;
    }

    const habitatBadge = document.getElementById('habitat-badge');
    if (habitatBadge) {
        habitatBadge.innerHTML = ` Hábitat: ${c.habitat || 'Desconocido'}`;
    }

    document.getElementById('vulnerable').innerText = c.vulnerable || 'Limitada';
    document.getElementById('resistente').innerText = c.resistente || 'Variada';

    if (c.supervivencia) {
        const survBox = document.getElementById('survival-box');
        if (survBox) {
            survBox.style.display = 'block';
            document.getElementById('survival-text').innerText = c.supervivencia;
        }
    }

    if (c.habilidad) {
        const skillSec = document.getElementById('skill-section');
        if (skillSec) {
            skillSec.style.display = 'block';
            document.getElementById('skill-title').innerText = c.habilidad_titulo || 'Rasgo Especial';
            document.getElementById('skill-text').innerText = c.habilidad;
        }
    }

    document.getElementById('name').innerText = c.nombre;
    document.getElementById('type').innerText = c.tipo;
    document.getElementById('categoria').innerText = c.categoria || 'Desconocida';
    document.getElementById('img').src = c.imagen;

    document.getElementById('ac').innerText = c.ac;
    document.getElementById('hp').innerText = c.hp;
    document.getElementById('speed').innerText = c.speed;

    document.getElementById('str').innerText = c.stats.str;
    document.getElementById('dex').innerText = c.stats.dex;
    document.getElementById('con').innerText = c.stats.con;
    document.getElementById('int').innerText = c.stats.int;
    document.getElementById('wis').innerText = c.stats.wis;
    document.getElementById('cha').innerText = c.stats.cha;

    document.getElementById('lore').innerText = c.lore;
}

/**
 * Muestra un mensaje de error en el grid principal
 */
function renderErrorMessage(msg) {
    const grid = document.getElementById('grid');
    if (grid) {
        grid.innerHTML = `<div class="error-msg" style="grid-column: 1/-1; text-align: center; padding: 50px; font-style: italic; opacity: 0.7;">
            <p>◈ ${msg} ◈</p>
        </div>`;
    }
}

/**
 * Maneja el error visual en la página de criatura
 */
function renderCreatureError() {
    const main = document.querySelector('.content-wrapper');
    if (main) {
        main.innerHTML = `<div style="text-align:center; padding: 100px 20px;">
            <h2 class="name">Pergamino Perdido</h2>
            <p style="font-style:italic; margin: 20px 0;">"Este relato ha sido borrado por el Vacío o las Brumas han reclamado su secretismo."</p>
            <button onclick="location.href='index.html'" class="filter-btn">Regresar al Refugio</button>
        </div>`;
    }
}

/**
 * Carga y renderiza las anotaciones desde localStorage
 */
function renderAnnotations(id) {
    const notesArea = document.getElementById('notes-area');
    if (!notesArea) return;

    // Recuperar nota guardada
    const savedNote = localStorage.getItem(`bestiary_note_${id}`) || '';
    notesArea.value = savedNote;

    // Configurar el autoguardado mientras se escribe
    notesArea.addEventListener('input', (e) => {
        saveAnnotation(id, e.target.value);
    });
}

/* ============================================================
   4. GESTIÓN DE ESTADO Y DISEÑO (LAYOUT)
   ============================================================ */

/**
 * Alterna entre diseño de 2 y 3 columnas (solo PC)
 */
function toggleLayout() {
    const grid = document.getElementById('grid');
    const btn = document.getElementById('btn-col-toggle');
    if (!grid || !btn) return;

    if (grid.classList.contains('three-cols')) {
        grid.classList.remove('three-cols');
        btn.innerText = '3 Columnas';
        localStorage.setItem('bestiaryLayout', '2-cols');
    } else {
        grid.classList.add('three-cols');
        btn.innerText = '2 Columnas';
        localStorage.setItem('bestiaryLayout', '3-cols');
    }
}

/**
 * Aplica la preferencia de columnas guardada
 */
function applySavedLayout() {
    const grid = document.getElementById('grid');
    const btn = document.getElementById('btn-col-toggle');
    if (!grid || !btn) return;

    const savedLayout = localStorage.getItem('bestiaryLayout');
    if (savedLayout === '3-cols') {
        grid.classList.add('three-cols');
        btn.innerText = '2 Columnas';
    } else {
        grid.classList.remove('three-cols');
        btn.innerText = '3 Columnas';
    }
}

/**
 * Guarda la anotación en el almacenamiento local
 */
function saveAnnotation(id, text) {
    localStorage.setItem(`bestiary_note_${id}`, text);
}

/* ============================================================
   5. INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('grid')) {
        loadList();
    }
    
    if (document.getElementById('name')) {
        loadCreature();
    }
});
