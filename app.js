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
    const freeText = cardCfg.freeSpaceText || 'FREE';
    const freeLogo = cardCfg.freeSpaceLogo ? `<img src="${cardCfg.freeSpaceLogo}" alt="Jamara Tika" class="free-space-icon">` : (cardCfg.freeSpaceEmoji || '🪷');
    const footerText = cardCfg.footerText || 'विजया दशमीको हार्दिक मंगलमय शुभकामना!';
    const footerLogo = cardCfg.footerLogo ? `<img src="${cardCfg.footerLogo}" alt="Jamara Tika" class="card-footer-icon">` : '';

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
                html += `<div class="bingo-cell free-space"><div class="free-space-content">${freeLogo}<span class="free-space-text">${freeText}</span></div></div>`;
            } else {
                html += `<div class="bingo-cell">${value}</div>`;
            }
        }
    }

    html += `
                </div>
            </div>
            <div class="card-bottom-bar">
                ${footerLogo ? `${footerLogo} ` : ''}<span>${footerText}</span>${footerLogo ? ` ${footerLogo}` : ''}
            </div>
        </div>`;

    return html;
}

function generateCards() {
    const startInput = document.getElementById('card-range-start');
    const endInput = document.getElementById('card-range-end');
    const perPageInput = document.getElementById('cards-per-page');

    const start = startInput ? (parseInt(startInput.value) || 1) : 1;
    const end = endInput ? (parseInt(endInput.value) || 200) : 200;
    const cardsPerPage = perPageInput ? (parseInt(perPageInput.value) || 4) : 4;

    // Preview: show first 8 cards
    const previewContainer = document.getElementById('card-preview');
    if (previewContainer) {
        const previewEnd = Math.min(start + 7, end);
        let previewHTML = '';
        for (let i = start; i <= previewEnd; i++) {
            previewHTML += createCardHTML(i);
        }
        previewContainer.innerHTML = previewHTML;
    }

    // Print area: all cards arranged in pages
    const printArea = document.getElementById('print-area');
    if (!printArea) return;
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
    generateCards();
    setTimeout(() => {
        window.print();
    }, 150);
}

window.addEventListener('beforeprint', () => {
    generateCards();
});


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

let isCalling = false;

function resetCaller() {
    isCalling = false;
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
    const letterEl = document.getElementById('current-letter');
    if (letterEl) {
        letterEl.textContent = '';
        letterEl.className = 'current-letter';
    }
    const numEl = document.getElementById('current-number');
    if (numEl) {
        numEl.textContent = '?';
        numEl.classList.remove('pop', 'celebrate-reveal', 'rolling');
    }
    document.getElementById('current-label').textContent = 'Press to Start';
    document.getElementById('numbers-called').textContent = '0';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('call-history').innerHTML = '<span class="history-placeholder">Numbers will appear here...</span>';

    const callBtn = document.getElementById('btn-call-number');
    if (callBtn) {
        callBtn.classList.remove('calling');
        const primary = callBtn.querySelector('.call-text-primary') || callBtn.querySelector('.call-text');
        const sub = callBtn.querySelector('.call-text-sub');
        const icon = callBtn.querySelector('.call-icon');
        if (primary) primary.textContent = 'नम्बर बोलाउनुहोस्';
        if (sub) sub.textContent = 'Call Bingo Number';
        if (icon) icon.textContent = '🔔';
    }

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
    if (isCalling) return;
    if (remainingNumbers.length === 0) {
        document.getElementById('current-label').textContent = 'All numbers called! Game Over!';
        return;
    }

    isCalling = true;
    const callBtn = document.getElementById('btn-call-number');
    const primary = callBtn ? (callBtn.querySelector('.call-text-primary') || callBtn.querySelector('.call-text')) : null;
    const sub = callBtn ? callBtn.querySelector('.call-text-sub') : null;
    const callIcon = callBtn ? callBtn.querySelector('.call-icon') : null;
    if (callBtn) callBtn.classList.add('calling');
    if (primary) primary.textContent = 'छान्दैछ...';
    if (sub) sub.textContent = 'Rolling Number...';
    if (callIcon) callIcon.textContent = '🎲';

    const numEl = document.getElementById('current-number');
    const letterEl = document.getElementById('current-letter');
    const labelEl = document.getElementById('current-label');

    // Start rolling suspense animation
    numEl.classList.remove('pop', 'celebrate-reveal');
    numEl.classList.add('rolling');
    if (labelEl) labelEl.textContent = 'दशैंको भाग्य नम्बर छान्दै... 🎲';

    let rollTicks = 0;
    const maxTicks = 16; // ~1.4 seconds of exciting suspense
    const rollInterval = setInterval(() => {
        rollTicks++;
        const randNum = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)] || Math.floor(Math.random() * 75) + 1;
        const randLetter = getLetterForNumber(randNum);

        numEl.textContent = randNum;
        if (letterEl) {
            letterEl.textContent = randLetter;
            letterEl.className = `current-letter col-${randLetter.toLowerCase()}`;
        }
        playTickSound(rollTicks);

        if (rollTicks >= maxTicks) {
            clearInterval(rollInterval);
            revealCalledNumber();
        }
    }, 85);
}

function revealCalledNumber() {
    const number = remainingNumbers.pop();
    calledNumbers.push(number);
    const letter = getLetterForNumber(number);
    const colClass = getColumnClass(number);

    const numEl = document.getElementById('current-number');
    const letterEl = document.getElementById('current-letter');
    const labelEl = document.getElementById('current-label');
    const callBtn = document.getElementById('btn-call-number');
    const primary = callBtn ? (callBtn.querySelector('.call-text-primary') || callBtn.querySelector('.call-text')) : null;
    const sub = callBtn ? callBtn.querySelector('.call-text-sub') : null;
    const callIcon = callBtn ? callBtn.querySelector('.call-icon') : null;

    numEl.classList.remove('rolling');
    numEl.textContent = number;
    void numEl.offsetWidth; // Force CSS reflow to re-trigger revealBurst animation
    numEl.classList.add('celebrate-reveal');

    if (letterEl) {
        letterEl.textContent = letter;
        letterEl.className = `current-letter col-${letter.toLowerCase()}`;
    }
    if (labelEl) {
        labelEl.textContent = `${letter} - ${number}`;
    }

    // Update called board
    const boardEl = document.getElementById(`board-${number}`);
    if (boardEl) boardEl.classList.add('called');

    // Update progress
    document.getElementById('numbers-called').textContent = calledNumbers.length;
    document.getElementById('progress-fill').style.width = `${(calledNumbers.length / 75) * 100}%`;

    // Update history
    const history = document.getElementById('call-history');
    const placeholder = history.querySelector('.history-placeholder');
    if (placeholder) placeholder.remove();

    const historyItem = document.createElement('span');
    historyItem.className = `history-item ${colClass}`;
    historyItem.textContent = `${letter}-${number}`;
    history.insertBefore(historyItem, history.firstChild);

    // Audio & celebratory sparkle particles
    playRevealSound();
    triggerConfetti();

    // Pulse Sanskrit mantra cards with divine blessing
    document.querySelectorAll('.mantra-card').forEach(card => {
        card.classList.remove('blessing-pulse');
        void card.offsetWidth;
        card.classList.add('blessing-pulse');
    });

    // Re-enable button
    if (callBtn) callBtn.classList.remove('calling');
    if (remainingNumbers.length === 0) {
        if (primary) primary.textContent = 'सबै बोलाइयो! 🏆';
        if (sub) sub.textContent = 'All Numbers Called';
        if (callIcon) callIcon.textContent = '🎉';
    } else {
        if (primary) primary.textContent = 'अर्को नम्बर बोलाउनुहोस्';
        if (sub) sub.textContent = 'Call Next Number';
        if (callIcon) callIcon.textContent = '🔔';
    }
    isCalling = false;
}

function playTickSound(tick) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(360 + (tick * 30), ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
}

function playRevealSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const startTime = ctx.currentTime + (idx * 0.06);
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);
            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    } catch (e) {}
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#FFD700', '#D32F2F', '#43A047', '#FB8C00', '#1E88E5', '#FFF'];
    for (let i = 0; i < 28; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const angle = Math.random() * Math.PI * 2;
        const dist = 60 + Math.random() * 110;
        const tx = Math.cos(angle) * dist + 'px';
        const ty = Math.sin(angle) * dist + 'px';
        piece.style.setProperty('--tx', tx);
        piece.style.setProperty('--ty', ty);
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(piece);
    }
}


// ==========================================
// ASHIRBAD (BLESSINGS) 
// ==========================================

// Build ASHIRBADS from config
function getAshirbads() {
    return CFG.blessings || {};
}

function loadAshirbads() {
    const blessings = getAshirbads();
    const container = document.getElementById('ashirbad-categories-container');
    if (!container) return;

    container.innerHTML = Object.entries(blessings).map(([key, cat]) => {
        const items = cat.items || [];
        const isSanskrit = key === 'sanskrit';
        const cardsHtml = items.map(a => {
            const titleHtml = a.title ? `<div class="ashirbad-badge">${a.title}</div>` : '';
            const nepaliFormatted = a.nepali ? a.nepali.replace(/\n/g, '<br>') : '';
            return `
                <div class="ashirbad-card ${isSanskrit ? 'sanskrit-card' : ''}">
                    ${titleHtml}
                    <div class="ashirbad-nepali ${isSanskrit ? 'sanskrit-text' : ''}">${nepaliFormatted}</div>
                    <div class="ashirbad-english">${a.english || ''}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="ashirbad-section" id="ashirbad-section-${key}">
                <h3>${cat.label || 'Blessings'}</h3>
                <div class="ashirbad-cards">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function randomAshirbad() {
    const blessings = getAshirbads();
    let allAshirbads = [];
    Object.values(blessings).forEach(cat => {
        if (cat.items && Array.isArray(cat.items)) {
            allAshirbads.push(...cat.items);
        }
    });
    if (allAshirbads.length === 0) return;

    const random = allAshirbads[Math.floor(Math.random() * allAshirbads.length)];
    const ashirbadCfg = CFG.ashirbadPage || {};
    const emojis = ashirbadCfg.winnerEmojis || ['🏆', '🎉', '🌺', '🪷', '🙏', '✨', '🎊', '🕉️'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const container = document.getElementById('winner-ashirbad');
    container.classList.remove('hidden');
    const titleHtml = random.title ? `<div class="winner-badge">${random.title}</div>` : '';
    const nepaliFormatted = random.nepali ? random.nepali.replace(/\n/g, '<br>') : '';
    container.innerHTML = `
        <div class="winner-emoji">${emoji}</div>
        ${titleHtml}
        <div class="winner-text">${nepaliFormatted}</div>
        <div class="winner-translation">${random.english || ''}</div>
    `;

    container.scrollIntoView({ behavior: 'smooth' });
}


// ==========================================
// BACKGROUND SLIDESHOW MANAGER
// ==========================================
let bgSlideIndex = 0;
let bgSlideInterval = null;
let bgIsPaused = false;

function initBgSlideshow() {
    const bgCfg = CFG.background || {};
    if (bgCfg.enabled === false) {
        const el = document.getElementById('bg-slideshow');
        if (el) el.style.display = 'none';
        const ctrl = document.getElementById('bg-controls');
        if (ctrl) ctrl.style.display = 'none';
        return;
    }

    const images = bgCfg.images || [
        { src: 'assets/bg-tika-jamara.jpg', title: 'Tika & Jamara Thali' },
        { src: 'assets/bg-linge-ping.jpg', title: 'Linge Ping Swing' },
        { src: 'assets/bg-jamara-pot.jpg', title: 'Jamara & Diyo' },
        { src: 'assets/bg-tika-blessing.jpg', title: 'Tika Blessing' }
    ];

    const container = document.getElementById('bg-slideshow');
    if (!container) return;

    // Render slides dynamically with overlay
    container.innerHTML = images.map((img, i) => `
        <div class="bg-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img.src}')"></div>
    `).join('') + '<div class="bg-overlay"></div>';

    updateBgSlideLabel();

    const intervalMs = (bgCfg.intervalSeconds || 8) * 1000;
    if (bgCfg.autoPlay !== false) {
        startBgSlideshow(intervalMs);
    }
}

function startBgSlideshow(intervalMs = 8000) {
    if (bgSlideInterval) clearInterval(bgSlideInterval);
    bgSlideInterval = setInterval(() => {
        if (!bgIsPaused) {
            nextBgSlide();
        }
    }, intervalMs);
}

function showBgSlide(index) {
    const slides = document.querySelectorAll('.bg-slide');
    if (!slides.length) return;
    bgSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        if (i === bgSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    updateBgSlideLabel();
}

function nextBgSlide() {
    showBgSlide(bgSlideIndex + 1);
}

function prevBgSlide() {
    showBgSlide(bgSlideIndex - 1);
}

function toggleBgSlideshow() {
    bgIsPaused = !bgIsPaused;
    updateBgSlideLabel();
}

function updateBgSlideLabel() {
    const label = document.getElementById('bg-slide-label');
    const slides = document.querySelectorAll('.bg-slide');
    if (!label || !slides.length) return;
    const bgCfg = CFG.background || {};
    const images = bgCfg.images || [];
    const currentTitle = images[bgSlideIndex]?.title || `Theme ${bgSlideIndex + 1}`;
    const statusIcon = bgIsPaused ? '⏸️' : '🌸';
    label.textContent = `${statusIcon} ${bgSlideIndex + 1}/${slides.length}`;
    label.title = `${currentTitle} (Click to ${bgIsPaused ? 'Resume' : 'Pause'})`;
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
    const navLogo = document.getElementById('nav-logo');
    const navIcon = document.querySelector('.nav-icon');
    const navTitle = document.querySelector('.nav-title');
    if (navLogo && event.navLogo) {
        navLogo.src = event.navLogo;
    } else if (navIcon && event.navIcon) {
        navIcon.textContent = event.navIcon;
    }
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

// ==========================================
// FLOATING DASHAIN MUSIC PLAYER
// ==========================================
const DASHAIN_PLAYLIST = [
    {
        id: 'R0qkiV5lLeM',
        title: 'Evergreen Dashain Best Songs Collection (दशैको गीत सङ्गालो)',
        artist: 'Sugam Pokharel, Muglan, Allare & more',
        badge: '🌟 Evergreen'
    },
    {
        id: 'LnOajzcjBz4',
        title: 'Dashain Tihar (दशैं तिहार)',
        artist: 'Sugam Pokharel (Official 1MB)',
        badge: '🎵 Superhit'
    },
    {
        id: 'bttgjrjIrQc',
        title: 'Dashain Aayo (दशैं आयो खाउँला पिउँला)',
        artist: 'Udit Narayan & Dipa Narayan (Muglan)',
        badge: '🎉 Classic'
    },
    {
        id: 'fF2uVCQEUdQ',
        title: 'Rato Tika Nidharma (रातो टीका निधारमा)',
        artist: 'Pramod Kharel & Melina Rai (OSR Digital)',
        badge: '✨ Festive Hit'
    },
    {
        id: 'QuLArfhYV2M',
        title: 'Malashree Dhoon (दशैं मंगल मालश्री धुन)',
        artist: 'Traditional Sacred Music Nepal',
        badge: '🕉️ Sacred Dhun'
    }
];

let currentTrackIndex = 0;

function toggleMusicWidget() {
    const widget = document.getElementById('dashain-music-widget');
    if (!widget) return;
    widget.classList.toggle('collapsed');
}

function minimizeMusicWidget() {
    const widget = document.getElementById('dashain-music-widget');
    if (widget) {
        widget.classList.add('collapsed');
    }
}

function closeMusicWidget() {
    minimizeMusicWidget();
}

function playTrack(index) {
    if (index < 0 || index >= DASHAIN_PLAYLIST.length) return;
    currentTrackIndex = index;
    const track = DASHAIN_PLAYLIST[index];
    
    const iframe = document.getElementById('dashain-yt-iframe');
    const trackNameEl = document.getElementById('current-track-name');
    const statusEl = document.getElementById('music-pill-status');
    const widget = document.getElementById('dashain-music-widget');
    const openYtBtn = document.getElementById('btn-open-yt');

    if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${track.id}?autoplay=1&enablejsapi=1`;
    }
    if (openYtBtn) {
        openYtBtn.href = `https://www.youtube.com/watch?v=${track.id}&list=RD${track.id}`;
    }
    if (trackNameEl) {
        trackNameEl.textContent = track.title;
    }
    if (statusEl) {
        statusEl.textContent = 'Playing 🎶';
    }
    if (widget) {
        widget.classList.add('playing');
    }

    // Update active class in playlist
    document.querySelectorAll('.playlist-item').forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function initMusicPlayer() {
    const container = document.getElementById('music-playlist-items');
    if (!container) return;

    container.innerHTML = DASHAIN_PLAYLIST.map((track, idx) => `
        <div class="playlist-item ${idx === 0 ? 'active' : ''}" onclick="playTrack(${idx})" title="Play ${track.title}">
            <span class="playlist-item-icon">${idx === 0 ? '▶' : '🎵'}</span>
            <div class="playlist-item-info">
                <span class="playlist-item-title">${track.title}</span>
                <span class="playlist-item-artist">${track.artist}</span>
            </div>
            <span class="playlist-badge" style="font-size: 0.65rem; background: rgba(255,215,0,0.15); border: 1px solid rgba(255,215,0,0.3); padding: 2px 6px; border-radius: 4px; color: #FFE082;">${track.badge}</span>
        </div>
    `).join('');
}

// Quick winning rules reference drawer for caller
function toggleCallerRules() {
    const drawer = document.getElementById('caller-rules-drawer');
    const arrow = document.getElementById('rules-drawer-arrow');
    const btn = document.getElementById('btn-caller-rules');
    if (!drawer) return;
    const isCollapsed = drawer.classList.toggle('collapsed');
    if (arrow) {
        arrow.textContent = isCollapsed ? '▼' : '▲';
    }
    if (btn) {
        btn.setAttribute('aria-expanded', !isCollapsed);
    }
}

// Generate cards and initialize on load
window.addEventListener('DOMContentLoaded', () => {
    // Apply configuration to HTML
    applyConfig();

    // Initialize background slideshow
    initBgSlideshow();

    // Generate cards (both preview & print area)
    generateCards();

    // Load ashirbads
    loadAshirbads();

    // Initialize floating music player
    initMusicPlayer();
});
