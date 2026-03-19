// --- Data Source (Based on the Reference Repo) ---
const proxies = [
    { name: "UBX Proxy", url: "https://d9by6xfdi9c2r.cloudfront.net/web/", type: "Proxy", desc: "Ultra-fast resilient proxy on Cloudfront." },
    { name: "Surfdoge", url: "https://surfdoge.pro/", type: "Proxy", desc: "Fast and reliable web proxy based on DogeNetwork." },
    { name: "CroxyProxy", url: "https://www.croxyproxy.com/", type: "Proxy", desc: "Advanced free web proxy. Supports video hosting sites." },
    { name: "Holy Unblocker", url: "https://holyunblocker.org/", type: "Proxy", desc: "Flagship web proxy with stealth mode features." },
    { name: "Incognito", url: "https://incog.works/", type: "Proxy", desc: "Sleek and stealthy browsing experience." },
    { name: "Alu", url: "https://aluu.xyz/en/", type: "Proxy", desc: "Minimalist proxy interface." },
    { name: "ProxySite", url: "https://www.proxysite.com/", type: "Proxy", desc: "Classic robust proxy server." },
    { name: "Browser.lol", url: "https://browser.lol/", type: "Browser", desc: "Cloud hosted browser environment." },
    { name: "Galaxy Hub", url: "https://galaxyhub.my.canva.site", type: "Portal", desc: "Collection of unblocked tools and links." }
];

const games = [
    { name: "SuperTuxKart", url: "https://supertuxkart.pages.dev/", type: "Racing", desc: "Local WASM port of SuperTuxKart." },
    { name: "2048", url: "games/2048/index.html", type: "Puzzle", desc: "Classic offline 2048 game." },
    { name: "Floppy Bird", url: "games/flappybird/index.html", type: "Arcade", desc: "HTML5 Flappy Bird clone." },
    { name: "1v1.LOL", url: "https://1v1.lol/", type: "Shooter", desc: "Competitive third-person shooter and building game." },
    { name: "Super Mario 64", url: "https://arkshocer.github.io/sm64/", type: "Platformer", desc: "Super Mario 64 decompiled web port." },
    { name: "Minecraft Classic", url: "https://classic.minecraft.net/", type: "Sandbox", desc: "Original Minecraft browser build." },
    { name: "Smash Karts", url: "https://smashkarts.io/", type: "Racing", desc: "Multiplayer kart battle arena." },
    { name: "Slope", url: "https://y8.com/games/slope", type: "Arcade", desc: "Fast-paced physics ball rolling game." }
];

// --- DOM Elements ---
const proxyGrid = document.getElementById('proxy-grid');
const gameGrid = document.getElementById('game-grid');
const repoGrid = document.getElementById('repo-grid');
const searchInput = document.getElementById('search-input');
const navLinks = document.querySelectorAll('.nav-links a');
const tabContents = document.querySelectorAll('.tab-content');

const panicBtn = document.getElementById('panic-btn');
const panicUrlInput = document.getElementById('panic-url');

const cloakPreset = document.getElementById('cloak-preset');
const applyCloakBtn = document.getElementById('apply-cloak');

// --- Functions ---

// Render Cards (V2: Use Iframe instead of _blank)
function renderCards(data, container) {
    container.innerHTML = '';
    data.forEach(item => {
        const card = document.createElement('a');
        card.href = '#';
        card.className = 'glass-card';
        card.innerHTML = `
            <span class="card-badge">${item.type}</span>
            <div class="card-title">${item.name}</div>
            <div class="card-desc">${item.desc}</div>
        `;

        // Exception for SuperTuxKart (Requires WebAssembly SharedArrayBuffer / COOP headers)
        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.name === "SuperTuxKart") {
                window.open(item.url, '_blank', 'noopener,noreferrer');
            } else {
                openIframe(item.url, item.name);
            }
        });

        container.appendChild(card);
    });
}

// Initial Render
renderCards(proxies, proxyGrid);
renderCards(games, gameGrid);
if (typeof archiveRepos !== 'undefined') renderCards(archiveRepos, repoGrid);

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();

    // Check which tab is active
    const activeTab = document.querySelector('.nav-links a.active').getAttribute('href').substring(1);

    if (activeTab === 'proxies') {
        const filtered = proxies.filter(p => p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term));
        renderCards(filtered, proxyGrid);
    } else if (activeTab === 'games') {
        const filtered = games.filter(g => g.name.toLowerCase().includes(term) || g.desc.toLowerCase().includes(term));
        renderCards(filtered, gameGrid);
    } else if (activeTab === 'repos') {
        if (typeof archiveRepos !== 'undefined') {
            const filtered = archiveRepos.filter(r => r.name.toLowerCase().includes(term) || r.desc.toLowerCase().includes(term));
            renderCards(filtered, repoGrid);
        }
    }
});

// Tab Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all links and tabs
        navLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active-section'));

        // Add active class to clicked link and corresponding tab
        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        document.getElementById(targetId).classList.add('active-section');

        // Ensure all tabs reset correctly
        searchInput.value = '';
        renderCards(proxies, proxyGrid);
        renderCards(games, gameGrid);
        renderCards(archiveRepos, repoGrid);
    });
});

// --- Panic Feature ---
function triggerPanic() {
    let url = panicUrlInput.value.trim();
    if (!url) url = 'https://classroom.google.com';

    // Ensure it has http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Open new tab
    const newTab = window.open(url, '_blank');
    if (newTab) {
        newTab.focus();
    }

    // Attempt to close current tab, fallback to replacing it with google
    window.location.replace('https://www.google.com');
    try {
        window.close();
    } catch (e) { }
}

panicBtn.addEventListener('click', triggerPanic);

// Keyboard shortcuts for Panic (Escape or Tilde)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === '`' || e.key === '~') {
        triggerPanic();
    }
});

// --- Tab Cloaking Feature ---
const cloakSettings = {
    none: { title: "Dashboard", icon: "favicon.ico" },
    google: { title: "Google", icon: "https://www.google.com/favicon.ico" },
    docs: { title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" },
    drive: { title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
    classroom: { title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
    canvas: { title: "Dashboard", icon: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico" }
};

applyCloakBtn.addEventListener('click', () => {
    const preset = cloakPreset.value;
    const settings = cloakSettings[preset];

    if (settings) {
        document.title = settings.title;
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = settings.icon;
    }
});

// --- Iframe Overlay Logic ---
const iframeContainer = document.getElementById('iframe-container');
const mainIframe = document.getElementById('main-iframe');
const iframeTitle = document.getElementById('iframe-title');
const iframeCloseBtn = document.getElementById('iframe-close');
const iframeFullscreenBtn = document.getElementById('iframe-fullscreen');

function openIframe(url, name) {
    iframeTitle.textContent = name;
    mainIframe.src = url;
    iframeContainer.classList.add('active');
}

iframeCloseBtn.addEventListener('click', () => {
    iframeContainer.classList.remove('active');
    setTimeout(() => {
        mainIframe.src = '';
        iframeTitle.textContent = 'Loading...';
    }, 300); // clear after fade out
});

iframeFullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        iframeContainer.requestFullscreen().catch(err => {
            console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// --- About:Blank Spoofer Logic ---
const launchBlankBtn = document.getElementById('launch-blank');

launchBlankBtn.addEventListener('click', () => {
    // Hide the overlay temporarily so it doesn't get cloned into the new tab
    const overlay = document.getElementById('entry-overlay');
    if (overlay) overlay.style.display = 'none';

    let win = window.open('about:blank');
    if (win) {
        // Clone the entire current document's HTML (now without the overlay)
        let html = document.documentElement.outerHTML;
        
        // Write it to the new blank window
        win.document.open();
        win.document.write(html);
        win.document.close();
        
        // Transfer the style/script linking logically
        let baseElement = win.document.createElement('base');
        baseElement.href = window.location.href; 
        win.document.head.insertBefore(baseElement, win.document.head.firstChild);
        
        // Redirect the parent tab to Google Classroom
        window.location.replace('https://classroom.google.com');
    } else {
        if (overlay) overlay.style.display = 'flex'; // Restore if blocked
        alert("Pop-up blocker prevented Stealth Mode. Please allow popups for this site.");
    }
});

// --- Auto-Stealth Entry Overlay ---
const entryOverlay = document.getElementById('entry-overlay');
const closeOverlayBtn = document.getElementById('close-overlay');

if (entryOverlay) {
    entryOverlay.addEventListener('click', (e) => {
        // If they click the Close 'X' button, just dismiss the overlay normally
        if (e.target === closeOverlayBtn) {
            entryOverlay.style.opacity = '0';
            setTimeout(() => {
                entryOverlay.style.display = 'none';
            }, 500);
            return;
        }

        // Otherwise, launch stealth mode
        launchBlankBtn.click();
    });
}
