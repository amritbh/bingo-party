/* ========================================
   BINGO PARTY - Application Logic
   Reads customizations from config.js
   ======================================== */

// Shorthand for config access
const CFG = typeof BINGO_CONFIG !== 'undefined' ? BINGO_CONFIG : {};

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Show selected page
    document.getElementById(`page-${pageName}`).classList.add('active');
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Auto-generate cards preview if switching to cards page
    if (pageName === 'cards') {
        generateCards();
    }

    // Initialize board if switching to caller
    if (pageName === 'caller' && !boardInitialized) {
        initBoard();
    }

    // Load ashirbads if switching to ashirbad page
    if (pageName === 'ashirbad') {
        loadAshirbads();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation click handlers
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
});


// ==========================================
// BINGO CARD GENERATION
// ==========================================

// Seeded random number generator for reproducible cards
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    // Fisher-Yates shuffle
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(this.next() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}

const DASHAIN_BLESSINGS = [
    "विजया दशमी",
    "जमरा टीका",
    "शुभ दशैं",
    "🪷 FREE 🪷",
    "दशैंको शुभकामना"
];

function generateBingoCard(cardId) {
    const rng = new SeededRandom(cardId * 7919 + 42);

    const columns = [];
    for (let col = 0; col < 5; col++) {
        const min = col * 15 + 1;
        const max = col * 15 + 15;
        const pool = [];
        for (let n = min; n <= max; n++) pool.push(n);
        const shuffled = rng.shuffle(pool);
        columns.push(shuffled.slice(0, 5));
    }

    // Set free space in center (row 2, col 2)
    columns[2][2] = 'FREE';

    return columns;
}

function createCardHTML(cardId) {
    const columns = generateBingoCard(cardId);
    const letters = ['B', 'I', 'N', 'G', 'O'];
    const cardCfg = CFG.card || {};
    const headerText = cardCfg.headerText || 'BINGO';
    const freeEmoji = cardCfg.freeSpaceEmoji || '🪷';
    const freeText = cardCfg.freeSpaceText || 'FREE';
    const footerText = cardCfg.footerText || 'Good Luck! 🎉';

    let html = `
        <div class="bingo-card" id="card-${cardId}">
            <div class="card-top-bar">
                <span class="card-title">${headerText}</span>
                <span class="card-number">#${String(cardId).padStart(3, '0')}</span>
            </div>
            <div class="card-body">
                <div class="bingo-header-row">
                    ${letters.map(l => `<div class="bingo-header-cell">${l}</div>`).join('')}
                </div>
                <div class="bingo-grid">`;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            const value = columns[col][row];
            if (value === 'FREE') {
                html += `<div class="bingo-cell free-space">${freeEmoji}<br>${freeText}</div>`;
            } else {
                html += `<div class="bingo-cell">${value}</div>`;
            }
        }
    }

    html += `
                </div>
            </div>
            <div class="card-bottom-bar">
                ${footerText}
            </div>
        </div>`;

    return html;
}

function generateCards() {
    const start = parseInt(document.getElementById('card-range-start').value) || 1;
    const end = parseInt(document.getElementById('card-range-end').value) || 200;
    const cardsPerPage = parseInt(document.getElementById('cards-per-page').value) || 4;

    // Preview: show first 8 cards
    const previewContainer = document.getElementById('card-preview');
    const previewEnd = Math.min(start + 7, end);
    let previewHTML = '';
    for (let i = start; i <= previewEnd; i++) {
        previewHTML += createCardHTML(i);
    }
    previewContainer.innerHTML = previewHTML;

    // Print area: all cards arranged in pages
    const printArea = document.getElementById('print-area');
    let printHTML = '';
    let pageCards = [];

    for (let i = start; i <= end; i++) {
        pageCards.push(createCardHTML(i));
        if (pageCards.length === cardsPerPage || i === end) {
            printHTML += `<div class="print-page cards-${cardsPerPage}">`;
            printHTML += pageCards.join('');
            printHTML += '</div>';
            pageCards = [];
        }
    }
    printArea.innerHTML = printHTML;
}

function printCards() {
    generateCards(); // Ensure print area is populated
    window.print();
}


// ==========================================
// NUMBER CALLER
// ==========================================

let calledNumbers = [];
let remainingNumbers = [];
let boardInitialized = false;

function initBoard() {
    boardInitialized = true;

    // Create the number board
    const columns = {
        'b': { min: 1, max: 15 },
        'i': { min: 16, max: 30 },
        'n': { min: 31, max: 45 },
        'g': { min: 46, max: 60 },
        'o': { min: 61, max: 75 }
    };

    for (const [col, range] of Object.entries(columns)) {
        const container = document.getElementById(`col-${col}`);
        let html = '';
        for (let n = range.min; n <= range.max; n++) {
            html += `<div class="board-number" id="board-${n}">${n}</div>`;
        }
        container.innerHTML = html;
    }

    resetCaller();
}

function resetCaller() {
    calledNumbers = [];
    remainingNumbers = [];
    for (let i = 1; i <= 75; i++) {
        remainingNumbers.push(i);
    }

    // Shuffle remaining numbers
    for (let i = remainingNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingNumbers[i], remainingNumbers[j]] = [remainingNumbers[j], remainingNumbers[i]];
    }

    // Reset display
    document.getElementById('current-letter').textContent = '🪷';
    document.getElementById('current-number').textContent = '?';
    document.getElementById('current-label').textContent = 'Press to Start';
    document.getElementById('numbers-called').textContent = '0';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('call-history').innerHTML = '<span class="history-placeholder">Numbers will appear here...</span>';

    // Reset board colors
    document.querySelectorAll('.board-number').forEach(el => {
        el.classList.remove('called');
    });
}

function getLetterForNumber(num) {
    if (num <= 15) return 'B';
    if (num <= 30) return 'I';
    if (num <= 45) return 'N';
    if (num <= 60) return 'G';
    return 'O';
}

function getColumnClass(num) {
    if (num <= 15) return 'col-b';
    if (num <= 30) return 'col-i';
    if (num <= 45) return 'col-n';
    if (num <= 60) return 'col-g';
    return 'col-o';
}

function callNumber() {
    if (remainingNumbers.length === 0) {
        document.getElementById('current-label').textContent = 'All numbers called! Game Over!';
        return;
    }

    const number = remainingNumbers.pop();
    calledNumbers.push(number);
    const letter = getLetterForNumber(number);
    const colClass = getColumnClass(number);

    // Update big display
    const numEl = document.getElementById('current-number');
    numEl.textContent = number;
    numEl.classList.remove('pop');
    void numEl.offsetWidth; // Force reflow
    numEl.classList.add('pop');

    document.getElementById('current-letter').textContent = letter;
    document.getElementById('current-label').textContent = `${letter}-${number}`;

    // Update board
    const boardEl = document.getElementById(`board-${number}`);
    if (boardEl) boardEl.classList.add('called');

    // Update progress
    document.getElementById('numbers-called').textContent = calledNumbers.length;
    document.getElementById('progress-fill').style.width = `${(calledNumbers.length / 75) * 100}%`;

    // Update history
    const history = document.getElementById('call-history');
    // Remove placeholder
    const placeholder = history.querySelector('.history-placeholder');
    if (placeholder) placeholder.remove();

    const historyItem = document.createElement('span');
    historyItem.className = `history-item ${colClass}`;
    historyItem.textContent = `${letter}-${number}`;
    history.insertBefore(historyItem, history.firstChild);

    // Play a subtle click sound via Web Audio API
    playCallSound();
}

function playCallSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Audio not supported, ignore
    }
}


// ==========================================
// ASHIRBAD (BLESSINGS) 
// ==========================================

// Build ASHIRBADS from config (falls back to empty if no config)
function getAshirbads() {
    const blessings = CFG.blessings || {};
    return {
        category1: blessings.category1 || { label: 'Category 1', items: [] },
        category2: blessings.category2 || { label: 'Category 2', items: [] },
        category3: blessings.category3 || { label: 'Category 3', items: [] },
    };
}

function loadAshirbads() {
    const ashirbads = getAshirbads();

    // Update section labels from config
    const sections = document.querySelectorAll('.ashirbad-section');
    const categories = [ashirbads.category1, ashirbads.category2, ashirbads.category3];
    const containerIds = ['ashirbad-girls', 'ashirbad-boys', 'ashirbad-all'];

    categories.forEach((cat, i) => {
        if (sections[i]) {
            sections[i].querySelector('h3').innerHTML = cat.label;
        }
        renderAshirbadCards(containerIds[i], cat.items);
    });
}

function renderAshirbadCards(containerId, ashirbads) {
    const container = document.getElementById(containerId);
    container.innerHTML = ashirbads.map(a => `
        <div class="ashirbad-card">
            <div class="ashirbad-nepali">${a.nepali}</div>
            <div class="ashirbad-english">${a.english}</div>
        </div>
    `).join('');
}

function randomAshirbad() {
    const ashirbads = getAshirbads();
    const allAshirbads = [
        ...ashirbads.category1.items,
        ...ashirbads.category2.items,
        ...ashirbads.category3.items
    ];
    if (allAshirbads.length === 0) return;

    const random = allAshirbads[Math.floor(Math.random() * allAshirbads.length)];
    const ashirbadCfg = CFG.ashirbadPage || {};
    const emojis = ashirbadCfg.winnerEmojis || ['🏆', '🎉', '🌺', '🪷', '🙏', '✨', '🎊'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const container = document.getElementById('winner-ashirbad');
    container.classList.remove('hidden');
    container.innerHTML = `
        <div class="winner-emoji">${emoji}</div>
        <div class="winner-text">${random.nepali}</div>
        <div class="winner-translation">${random.english}</div>
    `;

    container.scrollIntoView({ behavior: 'smooth' });
}


// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
    // Space bar calls number when on caller page
    if (e.code === 'Space' && document.getElementById('page-caller').classList.contains('active')) {
        e.preventDefault();
        callNumber();
    }
});


// ==========================================
// INITIALIZATION
// ==========================================

// Apply config to HTML elements on load
function applyConfig() {
    const event = CFG.event || {};
    const ashirbadCfg = CFG.ashirbadPage || {};

    // Update nav brand
    const navIcon = document.querySelector('.nav-icon');
    const navTitle = document.querySelector('.nav-title');
    if (navIcon && event.navIcon) navIcon.textContent = event.navIcon;
    if (navTitle && event.title) navTitle.textContent = event.title;

    // Update hero
    const heroH1 = document.querySelector('.hero h1');
    const heroH2 = document.querySelector('.hero h2');
    const heroSub = document.querySelector('.hero-subtitle');
    if (heroH1 && event.title) heroH1.textContent = event.title;
    if (heroH2 && event.subtitle) heroH2.textContent = event.subtitle;
    if (heroSub && event.tagline) heroSub.textContent = event.tagline;

    // Update stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[0] && event.totalCards) statNumbers[0].textContent = event.totalCards;
    if (statNumbers[1] && event.totalPlayers) statNumbers[1].textContent = event.totalPlayers;

    // Update card range defaults
    const rangeEnd = document.getElementById('card-range-end');
    if (rangeEnd && event.totalCards) {
        rangeEnd.value = event.totalCards;
        rangeEnd.max = event.totalCards;
    }

    // Update ashirbad page header
    const ashH2 = document.querySelector('.ashirbad-header h2');
    const ashH3 = document.querySelector('.ashirbad-header h3');
    const ashP = document.querySelector('.ashirbad-header p');
    if (ashH2 && ashirbadCfg.titleNepali) ashH2.textContent = ashirbadCfg.titleNepali;
    if (ashH3 && ashirbadCfg.titleEnglish) ashH3.textContent = ashirbadCfg.titleEnglish;
    if (ashP && ashirbadCfg.subtitle) ashP.textContent = ashirbadCfg.subtitle;

    // Update random button text
    const randBtn = document.getElementById('btn-random-ashirbad');
    if (randBtn && ashirbadCfg.randomButtonText) randBtn.textContent = ashirbadCfg.randomButtonText;

    // Apply custom theme colors if provided
    if (CFG.theme) {
        const root = document.documentElement;
        const t = CFG.theme;
        if (t.primary)      root.style.setProperty('--tika-red', t.primary);
        if (t.primaryDeep)  root.style.setProperty('--tika-red-deep', t.primaryDeep);
        if (t.primaryLight) root.style.setProperty('--tika-red-light', t.primaryLight);
        if (t.secondary)    root.style.setProperty('--jamara-green', t.secondary);
        if (t.accent)       root.style.setProperty('--marigold-yellow', t.accent);
        if (t.gold)         root.style.setProperty('--gold', t.gold);
        if (t.bgDark)       root.style.setProperty('--bg-dark', t.bgDark);
        if (t.bgCard)       root.style.setProperty('--bg-card', t.bgCard);
    }

    // Update page title
    if (event.subtitle) {
        document.title = `${event.subtitle} — ${event.title || 'Bingo'}`;
    }
}

// Generate preview cards on load
window.addEventListener('DOMContentLoaded', () => {
    // Apply configuration to HTML
    applyConfig();

    // Pre-generate a few preview cards
    const previewContainer = document.getElementById('card-preview');
    let previewHTML = '';
    for (let i = 1; i <= 4; i++) {
        previewHTML += createCardHTML(i);
    }
    previewContainer.innerHTML = previewHTML;

    // Load ashirbads
    loadAshirbads();
});
