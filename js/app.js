/**
 * BESTIARIO ARCANO - Lógica de Aplicación
 * Organización profesional por sectores
 */

/* ============================================================
   0. SISTEMA DE IDIOMA (I18N)
   ============================================================ */
let currentLang = localStorage.getItem('bestiaryLang') || 'es';

const TRANSLATIONS = {
    es: {
        pageTitle: 'El Bestiario Arcano',
        mainTitle: 'Bestiario Arcano',
        subtitle: 'Crónicas de Criaturas Olvidadas',
        btnMonsters: 'Criaturas',
        btnBosses: 'Jefes',
        btnMoonOff: 'Apagar Farol',
        btnMoonOn: 'Encender Farol',
        btn3Cols: '3 Columnas',
        btn2Cols: '2 Columnas',
        backLink: '← Volver al Bestiario',
        backBtn: '« Regresar al Bestiario',
        dangerLabel: 'Nivel de Peligro',
        habitatLabel: 'Hábitat',
        habitatUnknown: 'Desconocido',
        vulnerableLabel: 'Vulnerable:',
        resistenteLabel: 'Resistente:',
        acLabel: 'Clase de Armadura:',
        hpLabel: 'Puntos de Vida:',
        speedLabel: 'Velocidad:',
        loreTitle: 'Crónicas y Relatos',
        combatTitle: '⚜ Guía de Combate ⚜',
        annotationsTitle: 'Anotaciones del Jugador',
        annotationsPlaceholder: 'Escribe tus hallazgos aquí...',
        captionText: 'Ilustración a mano de la criatura',
        selectLabel: 'Escoger Relato:',
        skillDefault: 'Rasgo Especial',
        indexErrMsg: 'El índice de criaturas ha sido borrado por el Vacío. Inténtalo más tarde.',
        errorTitle: 'Pergamino Perdido',
        errorMsg: '"Este relato ha sido borrado por el Vacío o las Brumas han reclamado su secretismo."',
        errorBtn: 'Regresar al Bestiario',
    },
    en: {
        pageTitle: 'The Arcane Bestiary',
        mainTitle: 'Arcane Bestiary',
        subtitle: 'Chronicles of Forgotten Creatures',
        btnMonsters: 'Creatures',
        btnBosses: 'Bosses',
        btnMoonOff: 'Douse Lantern',
        btnMoonOn: 'Light Lantern',
        btn3Cols: '3 Columns',
        btn2Cols: '2 Columns',
        backLink: '← Back to Bestiary',
        backBtn: '« Return to Bestiary',
        dangerLabel: 'Danger Level',
        habitatLabel: 'Habitat',
        habitatUnknown: 'Unknown',
        vulnerableLabel: 'Vulnerable:',
        resistenteLabel: 'Resistant:',
        acLabel: 'Armor Class:',
        hpLabel: 'Hit Points:',
        speedLabel: 'Speed:',
        loreTitle: 'Chronicles & Lore',
        combatTitle: '⚜ Combat Guide ⚜',
        annotationsTitle: 'Player Annotations',
        annotationsPlaceholder: 'Write your findings here...',
        captionText: 'Hand-drawn creature illustration',
        selectLabel: 'Choose Variant:',
        skillDefault: 'Special Trait',
        indexErrMsg: 'The creature index has been devoured by the Void. Try again later.',
        errorTitle: 'Lost Scroll',
        errorMsg: '"This tale has been erased by the Void, or the Mists have claimed its secrets."',
        errorBtn: 'Return to Bestiary',
    }
};

/** Returns translated string for given key */
function t(key) {
    return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || TRANSLATIONS['es'][key] || key;
}

/** Toggles the language dropdown open/closed */
function toggleLangDropdown() {
    const switcher = document.getElementById('lang-switcher');
    if (switcher) switcher.classList.toggle('open');
}

/** Sets the active language, saves preference, re-renders page */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('bestiaryLang', lang);
    const switcher = document.getElementById('lang-switcher');
    if (switcher) switcher.classList.remove('open');
    applyLanguage();
    if (document.getElementById('grid')) {
        filterType(localStorage.getItem('bestiaryFilter') || 'monster');
    }
    if (document.getElementById('name')) {
        loadCreature();
    }
}

/** Applies translations to all data-i18n elements and updates dynamic UI */
function applyLanguage() {
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'es';
    if (document.getElementById('main-title')) document.title = t('pageTitle');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    // Update language switcher button UI
    const flagEl = document.getElementById('lang-flag');
    const codeEl = document.getElementById('lang-code');
    if (flagEl) {
        flagEl.src = currentLang === 'en'
            ? 'https://flagcdn.com/20x15/us.png'
            : 'https://flagcdn.com/20x15/ar.png';
        flagEl.alt = currentLang === 'en' ? 'USA' : 'Argentina';
    }
    if (codeEl) codeEl.textContent = currentLang === 'en' ? 'EN' : 'ES';

    // Highlight active option
    const optEs = document.getElementById('lang-opt-es');
    const optEn = document.getElementById('lang-opt-en');
    if (optEs) optEs.classList.toggle('active', currentLang === 'es');
    if (optEn) optEn.classList.toggle('active', currentLang === 'en');

    // Sync dark mode button text
    const isDark = document.body.classList.contains('dark-mode');
    const moonBtn = document.getElementById('btn-moon-toggle');
    if (moonBtn) moonBtn.childNodes[moonBtn.childNodes.length - 1].textContent = isDark ? t('btnMoonOn') : t('btnMoonOff');

    // Sync column toggle button text
    const colBtn = document.getElementById('btn-col-toggle');
    const grid = document.getElementById('grid');
    if (colBtn && grid) {
        colBtn.childNodes[colBtn.childNodes.length - 1].textContent =
            grid.classList.contains('three-cols') ? t('btn2Cols') : t('btn3Cols');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const switcher = document.getElementById('lang-switcher');
    if (switcher && !switcher.contains(e.target)) {
        switcher.classList.remove('open');
    }
});

/* ============================================================
   1. VARIABLES Y CONFIGURACIÓN
   ============================================================ */
let allCreatures = [];
const DATA_PATH = 'data/';
const LIST_FILE = 'data/list.json';

/* ============================================================
   2. SERVICIOS DE DATOS (API / FETCH)
   ============================================================ */

/** Pre-carga las traducciones al inglés y las guarda en window */
async function loadEnTranslations() {
    if (window.enTranslations) return; // ya cargado
    try {
        const res = await fetch('data/translations_en.json');
        window.enTranslations = res.ok ? await res.json() : {};
    } catch (_) {
        window.enTranslations = {};
    }
}

/** Aplica las traducciones al inglés sobre un objeto criatura */
function applyEnOverlay(c, id) {
    if (currentLang !== 'en' || !window.enTranslations) return c;
    const tr = window.enTranslations[id];
    if (!tr) return c;
    const merged = { ...c };
    Object.keys(tr).forEach(k => {
        if (k !== 'variantes') merged[k] = tr[k];
    });
    if (c.is_multi && tr.variantes && c.variantes) {
        merged.variantes = c.variantes.map((v, i) =>
            tr.variantes[i] ? { ...v, ...tr.variantes[i] } : v
        );
    }
    return merged;
}

/**
 * Carga la lista principal de criaturas
 */
async function loadList() {
    try {
        const res = await fetch(LIST_FILE);
        if (!res.ok) throw new Error('No se pudo cargar el índice del bestiario');

        allCreatures = await res.json();
        await loadEnTranslations();

        // Recuperar el último filtro usado o por defecto 'monster'
        const lastFilter = localStorage.getItem('bestiaryFilter') || 'monster';
        filterType(lastFilter);
    } catch (error) {
        console.error('Error:', error);
        renderErrorMessage(t('indexErrMsg'));
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

        await loadEnTranslations();
        
        // Cargar lista para las flechas de navegación
        try {
            const listRes = await fetch(LIST_FILE);
            if (listRes.ok) {
                const list = await listRes.json();
                
                // Ordenar: primero monstruos alfabéticamente, luego jefes alfabéticamente
                const monsters = list.filter(c => c.tipo !== 'boss').sort((a, b) => a.nombre.localeCompare(b.nombre));
                const bosses = list.filter(c => c.tipo === 'boss').sort((a, b) => a.nombre.localeCompare(b.nombre));
                const sortedList = [...monsters, ...bosses];
                
                const currentIndex = sortedList.findIndex(c => c.id === id);
                if (currentIndex !== -1) {
                    const prevIndex = currentIndex === 0 ? sortedList.length - 1 : currentIndex - 1;
                    const nextIndex = currentIndex === sortedList.length - 1 ? 0 : currentIndex + 1;
                    
                    const prevEl = document.getElementById('prev-btn');
                    const nextEl = document.getElementById('next-btn');
                    
                    if (prevEl && nextEl) {
                        prevEl.onclick = () => location.href = `criatura.html?id=${sortedList[prevIndex].id}`;
                        nextEl.onclick = () => location.href = `criatura.html?id=${sortedList[nextIndex].id}`;
                        prevEl.style.display = 'inline-block';
                        nextEl.style.display = 'inline-block';
                    }
                }
            }
        } catch (e) {
            console.error('Error cargando lista para navegación:', e);
        }

        const res = await fetch(`${DATA_PATH}${id}.json`);
        if (!res.ok) throw new Error('Criatura no encontrada en los registros');

        let c = await res.json();
        c = applyEnOverlay(c, id);

        if (c.is_multi) {
            renderMultiCreature(c);
        } else {
            const tabsContainer = document.getElementById('variant-tabs');
            if (tabsContainer) tabsContainer.style.display = 'none';
            renderCreatureDetail(c);
        }

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
 * Renderiza la navegación de pestañas y maneja variantes
 */
function renderMultiCreature(c) {
    const tabsContainer = document.getElementById('variant-tabs');
    if (!tabsContainer) return;
    
    tabsContainer.style.display = 'flex';
    tabsContainer.innerHTML = '';
    
    // Asignar el ID del padre para anotaciones
    document.getElementById('name').dataset.parentId = c.id;
    
    // Crear el contenedor del selector con un label temático
    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'variant-select-wrapper';
    
    const label = document.createElement('label');
    label.innerText = t('selectLabel') + ' ';
    label.className = 'select-label';
    
    const select = document.createElement('select');
    select.className = 'variant-select';
    
    c.variantes.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = variant.nombre.replace("Elemental de ", "");
        select.appendChild(option);
    });
    
    select.onchange = (e) => {
        const variant = c.variantes[e.target.value];
        renderCreatureDetail(variant);
    };
    
    // Inicializar con la primera variante
    renderCreatureDetail(c.variantes[0]);
    
    selectWrapper.appendChild(label);
    selectWrapper.appendChild(select);
    tabsContainer.appendChild(selectWrapper);
}

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

    // Ordenar alfabéticamente por nombre
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));

    filtered.forEach(c => {
        const article = document.createElement('article');
        article.className = 'card' + (type === 'boss' ? ' boss-card' : '');
        // Use English name if available
        const displayName = (currentLang === 'en' && window.enTranslations && window.enTranslations[c.id])
            ? (window.enTranslations[c.id].nombre || c.nombre)
            : c.nombre;
        article.innerHTML = `<h3>${displayName}</h3>`;
        article.onclick = () => location.href = `criatura.html?id=${c.id}`;
        grid.appendChild(article);
    });

    applySavedLayout();
}

/**
 * Inyecta los datos de la criatura en la página de detalles
 */
function renderCreatureDetail(c) {
    if (c.rol === 'boss' || c.tipo === 'boss') {
        document.body.classList.add('boss-mode');
        document.getElementById('cursed-seal')?.classList.remove('seal-hidden');
        document.getElementById('cursed-seal')?.classList.add('void-seal');
    }

    const dangerLvl = document.getElementById('danger-level');
    if (dangerLvl) {
        const skulls = "☠️".repeat(c.peligro || 1);
        dangerLvl.innerHTML = `${t('dangerLabel')}: ${skulls}`;
    }

    const habitatBadge = document.getElementById('habitat-badge');
    if (habitatBadge) {
        habitatBadge.innerHTML = ` ${t('habitatLabel')}: ${c.habitat || t('habitatUnknown')}`;
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
            document.getElementById('skill-title').innerText = c.habilidad_titulo || t('skillDefault');
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
            <h2 class="name">${t('errorTitle')}</h2>
            <p style="font-style:italic; margin: 20px 0;">${t('errorMsg')}</p>
            <button onclick="location.href='index.html'" class="filter-btn">${t('errorBtn')}</button>
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
        btn.innerText = t('btn3Cols');
        localStorage.setItem('bestiaryLayout', '2-cols');
    } else {
        grid.classList.add('three-cols');
        btn.innerText = t('btn2Cols');
        localStorage.setItem('bestiaryLayout', '3-cols');
    }
}

/**
 * Alterna el modo oscuro (Farol Apagado/Encendido)
 */
function toggleDarkMode() {
    const btn = document.getElementById('btn-moon-toggle');
    const isDark = document.body.classList.toggle('dark-mode');
    
    if (isDark) {
        localStorage.setItem('bestiaryTheme', 'dark');
        if (btn) btn.innerText = t('btnMoonOn');
    } else {
        localStorage.setItem('bestiaryTheme', 'light');
        if (btn) btn.innerText = t('btnMoonOff');
    }
}

/**
 * Aplica la preferencia de tema guardada
 */
function applySavedDarkMode() {
    const savedTheme = localStorage.getItem('bestiaryTheme');
    const btn = document.getElementById('btn-moon-toggle');
    
    // Iterar en todos los botones de la página (por si acaso hubiese)
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (btn) btn.innerText = t('btnMoonOn');
    } else {
        document.body.classList.remove('dark-mode');
        if (btn) btn.innerText = t('btnMoonOff');
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
        btn.innerText = t('btn2Cols');
    } else {
        grid.classList.remove('three-cols');
        btn.innerText = t('btn3Cols');
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
    applySavedDarkMode();
    applyLanguage();

    if (document.getElementById('grid')) {
        loadList();
    }

    if (document.getElementById('name')) {
        loadCreature();
    }
});
