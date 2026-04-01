
let allCreatures = [];

async function loadList() {
    const res = await fetch('data/list.json');
    allCreatures = await res.json();

    // Recuperar el último filtro usado o por defecto 'monster'
    const lastFilter = localStorage.getItem('bestiaryFilter') || 'monster';
    filterType(lastFilter);
}

function filterType(type) {
    const grid = document.getElementById('grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Guardar la elección
    localStorage.setItem('bestiaryFilter', type);

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (type === 'monster') document.getElementById('btn-monsters')?.classList.add('active');
    if (type === 'boss') document.getElementById('btn-bosses')?.classList.add('active');

    // Update body class for "Boss Mode"
    if (type === 'boss') {
        document.body.classList.add('boss-mode');
    } else {
        document.body.classList.remove('boss-mode');
    }

    const filtered = allCreatures.filter(c => c.tipo === type);

    filtered.forEach(c => {
        const div = document.createElement('div');
        div.className = 'card' + (type === 'boss' ? ' boss-card' : '');
        div.innerHTML = `<h3>${c.nombre}</h3>`;
        div.onclick = () => location.href = `criatura.html?id=${c.id}`;
        grid.appendChild(div);
    });
}

async function loadCreature() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) return;

    const res = await fetch(`data/${id}.json`);
    const c = await res.json();

    // Check if it's a boss to apply boss-mode in the detail page
    if (c.rol === 'boss') {
        document.body.classList.add('boss-mode');
        document.getElementById('cursed-seal')?.classList.remove('seal-hidden');
        document.getElementById('cursed-seal')?.classList.add('void-seal');
    }
    // Populating Tactical Metadata
    const dangerLvl = document.getElementById('danger-level');
    if (dangerLvl) {
        const skulls = "☠️".repeat(c.peligro || 1);
        dangerLvl.innerHTML = `Nivel de Peligro: ${skulls}`;
    }

    const habitatBadge = document.getElementById('habitat-badge');
    if (habitatBadge) {
        habitatBadge.innerHTML = ` Hábitat: ${c.habitat || 'Desconocido'}`;
    }

    // Vulnerabilidades y Resistencias
    document.getElementById('vulnerable').innerText = c.vulnerable || 'Limitada';
    document.getElementById('resistente').innerText = c.resistente || 'Variada';

    // Survival Note
    if (c.supervivencia) {
        const survBox = document.getElementById('survival-box');
        if (survBox) {
            survBox.style.display = 'block';
            document.getElementById('survival-text').innerText = c.supervivencia;
        }
    }

    // Populating Skill section
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

loadList();
loadCreature();
