const API_KEY = "e3bbf6ee45mshae51a53c862ca72p1cd1a4jsna02238368745";
const API_URL = "https://free-to-play-games-database.p.rapidapi.com/api/games";

let allGames = [];
let selectedGame = null;
let filteredGames = []; // Szűrt játékok listája
let displayedGames = 0; // Eddig megjelenített játékok száma
const GAMES_PER_LOAD = 20; // Egyszerre ennyi játékot töltünk be
let isLoading = false; // Töltés folyamatban van-e
let currentLanguage = localStorage.getItem('language') || 'hu'; // Alapértelmezett nyelv

// ─── Fordítások ───────────────────────────────────────────
const translations = {
    hu: {
        'header-free': 'Ingyenes',
        'header-games': 'Játékok',
        'header-finder': 'Kereső',
        'header-subtitle': 'Fedezd fel a legjobb ingyenes játékokat',
        'search-placeholder': 'Játékok keresése...',
        'platform-all': 'Minden Platform',
        'platform-pc': 'PC (Windows)',
        'platform-browser': 'Webböngésző',
        'genre-all': 'Minden Műfaj',
        'genre-card': 'Kártyajáték',
        'genre-racing': 'Racing',
        'sort-relevance': 'Relevancia',
        'sort-date': 'Megjelenési Dátum',
        'sort-alpha': 'ABC Sorrend',
        'btn-search': 'Keresés',
        'games-title': 'Játékok',
        'loading': 'Betöltés...',
        'stats-title': 'Statisztika - Műfaj szerinti eloszlás',
        'favorites-title': 'Kedvenc Játékok',
        'top-title': 'Top Játékok',
        'modal-platform': 'Platform:',
        'modal-genre': 'Műfaj:',
        'btn-play': 'Játék Indítása',
        'btn-add-fav': '⭐ Kedvencekhez adás',
        'btn-remove-fav': '🗑️ Eltávolítás a kedvencekből',
        'btn-confirm-remove': '⚠️ Biztos vagy benne?',
        'tooltip-stats': '📊',
        'tooltip-favorites': '⭐',
        'tooltip-top': '🔥',
        'no-results': 'Nincs találat a keresési feltételeknek megfelelően.',
        'no-favorites': 'Még nincsenek kedvenc játékaid. Adj hozzá néhányat!',
        'no-top-games': 'Nincs elérhető adat a top játékokhoz.',
        'toast-added': 'hozzáadva a kedvencekhez!',
        'toast-removed': 'eltávolítva a kedvencek közül',
        'toast-already': 'Már a kedvencek között van!',
        'toast-error': 'Hiba történt!',
        'confirm-remove': 'Eltávolítod a kedvencek közül:',
        'stats-chart-title': 'Játékok műfaj szerinti megoszlása',
        'fav-view': 'Megnéz',
        'fav-remove': 'Törlés',
        'fav-confirm': 'Biztos?'
    },
    en: {
        'header-free': 'Free',
        'header-games': 'Games',
        'header-finder': 'Finder',
        'header-subtitle': 'Discover the best free-to-play games',
        'search-placeholder': 'Search games...',
        'platform-all': 'All Platforms',
        'platform-pc': 'PC (Windows)',
        'platform-browser': 'Web Browser',
        'genre-all': 'All Genres',
        'genre-card': 'Card Game',
        'genre-racing': 'Racing',
        'sort-relevance': 'Relevance',
        'sort-date': 'Release Date',
        'sort-alpha': 'Alphabetical',
        'btn-search': 'Search',
        'games-title': 'Games',
        'loading': 'Loading...',
        'stats-title': 'Statistics - Genre Distribution',
        'favorites-title': 'Favorite Games',
        'top-title': 'Top Games',
        'modal-platform': 'Platform:',
        'modal-genre': 'Genre:',
        'btn-play': 'Play Now',
        'btn-add-fav': '⭐ Add to Favorites',
        'btn-remove-fav': '🗑️ Remove from Favorites',
        'btn-confirm-remove': '⚠️ Are you sure?',
        'tooltip-stats': '📊',
        'tooltip-favorites': '⭐',
        'tooltip-top': '🔥',
        'no-results': 'No results found for your search criteria.',
        'no-favorites': 'You don\'t have any favorite games yet. Add some!',
        'no-top-games': 'No data available for top games.',
        'toast-added': 'added to favorites!',
        'toast-removed': 'removed from favorites',
        'toast-already': 'Already in favorites!',
        'toast-error': 'An error occurred!',
        'confirm-remove': 'Remove from favorites:',
        'stats-chart-title': 'Games by Genre Distribution',
        'fav-view': 'View',
        'fav-remove': 'Remove',
        'fav-confirm': 'Sure?'
    },
    sk: {
        'header-free': 'Hry',
        'header-games': 'zadarmo',
        'header-finder': '',
        'header-subtitle': 'Objavte najlepšie hry zadarmo',
        'search-placeholder': 'Hľadať hry...',
        'platform-all': 'Všetky Platformy',
        'platform-pc': 'PC (Windows)',
        'platform-browser': 'Webový Prehliadač',
        'genre-all': 'Všetky Žánre',
        'genre-card': 'Kartové hry',
        'genre-racing': 'Zavodné',
        'sort-relevance': 'Relevancia',
        'sort-date': 'Dátum Vydania',
        'sort-alpha': 'Abecedne',
        'btn-search': 'Hľadať',
        'games-title': 'Hry',
        'loading': 'Načítavam...',
        'stats-title': 'Štatistiky - Rozdelenie Žánrov',
        'favorites-title': 'Obľúbené Hry',
        'top-title': 'Top Hry',
        'modal-platform': 'Platforma:',
        'modal-genre': 'Žáner:',
        'btn-play': 'Hrať Teraz',
        'btn-add-fav': '⭐ Pridať do Obľúbených',
        'btn-remove-fav': '🗑️ Odstrániť z Obľúbených',
        'btn-confirm-remove': '⚠️ Ste si istý?',
        'tooltip-stats': '📊',
        'tooltip-favorites': '⭐',
        'tooltip-top': '🔥',
        'no-results': 'Nenašli sa žiadne výsledky pre vaše kritériá.',
        'no-favorites': 'Zatiaľ nemáte žiadne obľúbené hry. Pridajte niektoré!',
        'no-top-games': 'Nie sú k dispozícii údaje pre top hry.',
        'toast-added': 'pridané do obľúbených!',
        'toast-removed': 'odstránené z obľúbených',
        'toast-already': 'Už je v obľúbených!',
        'toast-error': 'Vyskytla sa chyba!',
        'confirm-remove': 'Odstrániť z obľúbených:',
        'stats-chart-title': 'Hry podľa Žánrov',
        'fav-view': 'Zobraziť',
        'fav-remove': 'Vymazať',
        'fav-confirm': 'Istý?'
    }
};

// ─── Nyelv váltás ───────────────────────────────────────────
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Fordítások alkalmazása
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Placeholder fordítások
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Tooltip fordítások
    document.querySelectorAll('[data-translate][title]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.title = translations[lang][key];
        }
    });
    
    // Aktív nyelv jelzése
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(`'${lang}'`)) {
            btn.classList.add('active');
        }
    });
    
    // Nyelv menü bezárása
    const langMenu = document.getElementById('languageMenu');
    if (langMenu) {
        langMenu.style.display = 'none';
    }
    
    // Canvas újrarajzolása ha a stats modal nyitva van
    const statsModal = document.getElementById('statsModal');
    if (statsModal && statsModal.classList.contains('show')) {
        setTimeout(() => drawCanvasStatsModal(), 100);
    }
    
    // Kedvenc gomb frissítése ha modal nyitva van
    const gameModal = document.getElementById('gameModal');
    if (gameModal && gameModal.classList.contains('show') && selectedGame) {
        updateFavoriteButton();
    }
}

// ─── Nyelv menü toggle ───────────────────────────────────────────
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Kívülre kattintás esetén bezárjuk a menüt
document.addEventListener('click', (e) => {
    const menu = document.getElementById('languageMenu');
    const langButton = document.getElementById('langButton');
    if (!menu.contains(e.target) && e.target !== langButton) {
        menu.style.display = 'none';
    }
});

// ─── API lekérés ───────────────────────────────────────────
async function loadGames() {
    const container = document.getElementById("games");
    container.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": API_KEY,
                "X-RapidAPI-Host": "free-to-play-games-database.p.rapidapi.com"
            }
        });

        allGames = await response.json();
        filterAndSortGames();
    } catch (e) {
        container.innerHTML = "<p>Error loading games.</p>";
        console.error(e);
    }
}

// ─── Filter + sort ─────────────────────────────────────────
function filterAndSortGames() {
    filteredGames = [...allGames];

    const search = document.getElementById("searchInput").value.toLowerCase();
    const platform = document.getElementById("platformSelect").value;
    const genre = document.getElementById("categorySelect").value;
    const sort = document.getElementById("sortSelect").value;

    if (search) filteredGames = filteredGames.filter(g => g.title.toLowerCase().includes(search));
    
    // Javított platform szűrés
    if (platform !== "all") {
        filteredGames = filteredGames.filter(g => {
            const gamePlatform = g.platform.toLowerCase();
            if (platform === "pc") {
                return gamePlatform.includes("windows") || gamePlatform.includes("pc");
            } else if (platform === "browser") {
                return gamePlatform.includes("browser") || gamePlatform.includes("web");
            }
            return false;
        });
    }
    
    if (genre) filteredGames = filteredGames.filter(g => g.genre === genre);

    switch(sort){
        case "alphabetical": filteredGames.sort((a,b)=>a.title.localeCompare(b.title)); break;
        case "release-date": filteredGames.sort((a,b)=>new Date(b.release_date)-new Date(a.release_date)); break;
        // relevance - eredeti sorrend marad
    }

    // Kezdjük elölről a megjelenítést
    displayedGames = 0;
    const container = document.getElementById("games");
    container.innerHTML = "";
    
    // Első adag betöltése
    loadMoreGames();
}

// ─── Játékok betöltése darabonként (infinite scroll) ─────────────────────────────
function loadMoreGames() {
    if (isLoading) return;
    
    const container = document.getElementById("games");
    const loadingIndicator = document.getElementById("loading-indicator");
    const gamesToLoad = filteredGames.slice(displayedGames, displayedGames + GAMES_PER_LOAD);
    
    if (gamesToLoad.length === 0) {
        if (displayedGames === 0) {
            container.innerHTML = `<p class='text-center'>${translations[currentLanguage]['no-results']}</p>`;
        }
        return;
    }
    
    isLoading = true;
    
    // Apró loading jelzés (opcionális, láthatatlan)
    if (displayedGames > 0 && loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    // Kis késleltetés a smooth betöltéshez
    setTimeout(() => {
        gamesToLoad.forEach(game => {
            const div = document.createElement("div");
            div.className = "game";
            div.style.opacity = "0";
            div.style.transform = "translateY(20px)";
            div.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            
            div.innerHTML = `
                <img src="${game.thumbnail}" alt="${game.title}">
                <div class="game-content">
                    <h5>${game.title}</h5>
                    <p>${game.short_description}</p>
                </div>
            `;
            div.onclick = () => openGameModal(game);
            container.appendChild(div);
            
            // Fade-in animáció
            setTimeout(() => {
                div.style.opacity = "1";
                div.style.transform = "translateY(0)";
            }, 10);
        });
        
        displayedGames += gamesToLoad.length;
        isLoading = false;
        
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }, 50);
}

// ─── Játéklista megjelenítés (DEPRECATED - már nem használjuk) ─────────────────────────────
function displayGames(games) {
    // Ez már nem kell, de meghagyjuk kompatibilitás miatt
    filteredGames = games;
    displayedGames = 0;
    const container = document.getElementById("games");
    container.innerHTML = "";
    loadMoreGames();
}

// ─── Modal ──────────────────────────────────────────────
function openGameModal(game){
    selectedGame=game;
    document.getElementById("modalTitle").textContent=game.title;
    document.getElementById("modalImage").src=game.thumbnail;
    document.getElementById("modalDesc").textContent=game.short_description;
    document.getElementById("modalPlatform").textContent=game.platform;
    document.getElementById("modalCategory").textContent=game.genre;
    document.getElementById("modalPlay").href=game.game_url;
    
    // Ellenőrizzük, hogy a játék kedvencek között van-e
    updateFavoriteButton();
    
    new bootstrap.Modal("#gameModal").show();
}

// ─── Kedvenc gomb frissítése ──────────────────────────────────────────
function updateFavoriteButton() {
    if (!selectedGame || !db) return;
    
    const favButton = document.getElementById("favButton");
    
    const stmtCheck = db.prepare("SELECT COUNT(*) AS count FROM favorites WHERE title = ?");
    stmtCheck.bind([selectedGame.title]);
    stmtCheck.step();
    const exists = stmtCheck.getAsObject().count;
    stmtCheck.free();
    
    if (exists) {
        // Már kedvenc - piros gomb törléshez
        favButton.innerHTML = translations[currentLanguage]['btn-remove-fav'];
        favButton.className = 'btn btn-danger btn-lg';
        favButton.dataset.isFavorite = 'true';
    } else {
        // Még nem kedvenc - sárga gomb hozzáadáshoz
        favButton.innerHTML = translations[currentLanguage]['btn-add-fav'];
        favButton.className = 'btn btn-warning btn-lg';
        favButton.dataset.isFavorite = 'false';
    }
}

// ─── Toast Notification ──────────────────────────────────────────
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('gameToast');
    const toastBody = document.getElementById('toastMessage');
    
    // Színek típus szerint
    const colors = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-warning',
        info: 'bg-info'
    };
    
    // Eltávolítjuk az előző színt
    toastEl.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    toastEl.classList.add(colors[type] || colors.success);
    
    toastBody.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl, {
        autohide: true,
        delay: 3000
    });
    toast.show();
}

// ─── Kedvencek ──────────────────────────────────────────
let favButtonTimeout = null; // Globális változó a timeout tárolására

document.getElementById("favButton").onclick = () => {
    if (!selectedGame || !db) {
        showToast(translations[currentLanguage]['toast-error'], 'error');
        return;
    }

    const favButton = document.getElementById("favButton");
    const isFavorite = favButton.dataset.isFavorite === 'true';
    const isConfirmState = favButton.dataset.confirmState === 'true';
    
    if (!isFavorite) {
        // Töröljük az esetleges timeout-ot
        if (favButtonTimeout) {
            clearTimeout(favButtonTimeout);
            favButtonTimeout = null;
        }
        
        // Hozzáadás a kedvencekhez
        const stmtInsert = db.prepare("INSERT INTO favorites (title, thumbnail, genre, platform) VALUES (?, ?, ?, ?)");
        stmtInsert.run([selectedGame.title, selectedGame.thumbnail, selectedGame.genre, selectedGame.platform]);
        stmtInsert.free();
        showToast(`✓ ${selectedGame.title} ${translations[currentLanguage]['toast-added']}`, 'success');
        
        // Explicit módon állítjuk be a confirmState-et false-ra
        favButton.dataset.confirmState = 'false';
        updateFavoriteButton();
    } else {
        // Már kedvenc - kétlépcsős törlés
        if (!isConfirmState) {
            // Töröljük az előző timeout-ot, ha van
            if (favButtonTimeout) {
                clearTimeout(favButtonTimeout);
            }
            
            // Első kattintás - megerősítés kérése
            favButton.innerHTML = translations[currentLanguage]['btn-confirm-remove'];
            favButton.className = 'btn btn-outline-danger btn-lg w-100';
            favButton.dataset.confirmState = 'true';
            
            // 3 másodperc múlva visszaáll az eredeti állapotba
            favButtonTimeout = setTimeout(() => {
                const currentFavButton = document.getElementById("favButton");
                if (currentFavButton && currentFavButton.dataset.confirmState === 'true') {
                    currentFavButton.dataset.confirmState = 'false';
                    updateFavoriteButton();
                }
                favButtonTimeout = null;
            }, 3000);
        } else {
            // Második kattintás - törlés
            // Töröljük a timeout-ot
            if (favButtonTimeout) {
                clearTimeout(favButtonTimeout);
                favButtonTimeout = null;
            }
            
            const stmtDelete = db.prepare("DELETE FROM favorites WHERE title = ?");
            stmtDelete.bind([selectedGame.title]);
            stmtDelete.run();
            stmtDelete.free();
            showToast(`✓ ${selectedGame.title} ${translations[currentLanguage]['toast-removed']}`, 'info');
            
            // Explicit módon állítjuk be a confirmState-et false-ra
            favButton.dataset.confirmState = 'false';
            updateFavoriteButton();
        }
    }
};   
// ─── Canvas grafikon (csak a modalban) ───────────────────────────────────
function drawCanvasStatsModal() {
    const canvas = document.getElementById("statsCanvasModal");
    const ctx = canvas.getContext("2d");
    
    // Canvas méretének beállítása - kisebb méret a modalhoz
    const modalBody = canvas.parentElement;
    const containerWidth = modalBody.clientWidth - 40; // 40px padding
    
    canvas.width = Math.min(containerWidth, 1000);
    canvas.height = Math.floor(canvas.width * 0.5); // 2:1 arány
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const topMargin = 60;
    const bottomMargin = 100;
    const leftMargin = 60;
    const rightMargin = 60;

    function normalizeGenre(g) {
        g = g.toLowerCase();
        if (g.includes("mmo")) return "MMO";
        if (g.includes("rpg")) return "RPG";
        if (g.includes("shooter")) return "Shooter";
        if (g.includes("strategy")) return "Strategy";
        if (g.includes("card")) return "Card Game";
        if (g.includes("sports")) return "Sports";
        if (g.includes("racing")) return "Racing";
        if (g.includes("action")) return "Action";
        if (g.includes("fighting")) return "Fighting";
        return "Other";
    }

    const genreCount = {};
    allGames.forEach(game => {
        const g = normalizeGenre(game.genre);
        genreCount[g] = (genreCount[g] || 0) + 1;
    });

    let entries = Object.entries(genreCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const genres = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);

    const max = Math.max(...values);
    const availableWidth = canvas.width - leftMargin - rightMargin;
    const availableHeight = canvas.height - topMargin - bottomMargin;

    const barWidth = Math.floor(availableWidth / genres.length * 0.7);
    const gap = Math.floor(availableWidth / genres.length * 0.3);

    // Színek az oszlopokhoz
    const colors = ['#45a29e', '#66FCF1', '#087E8B', '#0B3954', '#4ECDC4', '#FFA500', '#FF6B6B', '#4ECDC4', '#95E1D3', '#38Ada9'];

    genres.forEach((genre, i) => {
        const x = leftMargin + i * (barWidth + gap) + gap / 2;
        const barHeight = Math.floor((values[i] / max) * availableHeight);

        // Oszlop rajzolása gradienssel
        const gradient = ctx.createLinearGradient(0, canvas.height - bottomMargin - barHeight, 0, canvas.height - bottomMargin);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(1, 'rgba(31, 40, 51, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.shadowColor = colors[i % colors.length];
        ctx.shadowBlur = 15;
        ctx.fillRect(x, canvas.height - bottomMargin - barHeight, barWidth, barHeight);
        ctx.shadowBlur = 0;

        // Keretezés az oszlopoknak
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2;
        ctx.strokeRect(x, canvas.height - bottomMargin - barHeight, barWidth, barHeight);

        // Érték kiírása az oszlop tetejére
        ctx.fillStyle = "#fff";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(values[i], x + barWidth / 2, canvas.height - bottomMargin - barHeight - 15);

        // Műfaj neve forgással
        ctx.fillStyle = "#C5C6C7";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - bottomMargin + 20);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(genre, 0, 0);
        ctx.restore();
    });

    // X tengely
    ctx.strokeStyle = "#45a29e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftMargin, canvas.height - bottomMargin);
    ctx.lineTo(canvas.width - rightMargin, canvas.height - bottomMargin);
    ctx.stroke();

    // Y tengely
    ctx.beginPath();
    ctx.moveTo(leftMargin, topMargin);
    ctx.lineTo(leftMargin, canvas.height - bottomMargin);
    ctx.stroke();

    // Cím lefordítva
    ctx.fillStyle = "#66FCF1";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(translations[currentLanguage]['stats-chart-title'], canvas.width / 2, 20);
}

// ─── Modal manager - egyszerre csak egy modal ──────────────────────────────
let currentModal = null;

function closeCurrentModal() {
    if (currentModal) {
        const modalInstance = bootstrap.Modal.getInstance(currentModal);
        if (modalInstance) {
            modalInstance.hide();
        }
        currentModal = null;
    }
    
    // Extra biztonsági ellenőrzés - eltávolítjuk az összes backdrop-ot
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.remove();
    });
    
    // Body overflow visszaállítása
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

// ─── Modals ───────────────────────────────────────────
function openStatsModal() {
    closeCurrentModal(); // Bezár minden mást
    
    const modalEl = document.getElementById('statsModal');
    const modal = new bootstrap.Modal(modalEl);
    currentModal = modalEl;
    modal.show();
    
    // Kis késleltetés hogy a modal teljesen megjelenjen
    setTimeout(() => {
        drawCanvasStatsModal();
    }, 300);
}

// Window resize event - újrarajzolja a canvast ha a modal látható
window.addEventListener('resize', () => {
    const statsModal = document.getElementById('statsModal');
    if (statsModal && statsModal.classList.contains('show')) {
        drawCanvasStatsModal();
    }
});

function openTopGamesModal() {
    closeCurrentModal();
    
    const modalEl = document.getElementById('topGamesModal');
    const container = document.getElementById("topGamesList");
    container.innerHTML = "";

    const topGames = allGames.filter(g => g.id !== undefined)
                             .sort((a,b)=>b.id-a.id)
                             .slice(0,10);

    if(topGames.length === 0){
        container.innerHTML = `<p class='text-center'>${translations[currentLanguage]['no-top-games']}</p>`;
    } else {
        topGames.forEach(game => {
            const div = document.createElement("div");
            div.className="list-group-item list-group-item-action d-flex align-items-center";
            div.style.cursor="pointer";
            div.innerHTML=`
                <img src="${game.thumbnail}" alt="${game.title}" style="width:60px; height:40px; object-fit:cover; border-radius:6px; margin-right:10px;">
                <div>
                    <strong>${game.title}</strong><br>
                    <small>${game.genre} | ${game.platform}</small>
                </div>
            `;
            div.onclick = () => {
                closeCurrentModal();
                openGameModal(game);
            };
            container.appendChild(div);
        });
    }

    currentModal = modalEl;
    new bootstrap.Modal(modalEl).show();
}

function openFavoritesModal() {
    closeCurrentModal();
    
    const modalEl = document.getElementById('favoritesModal');
    const modalBody = document.getElementById("favoritesModalBody");
    
    if (!modalBody) {
        console.error("favoritesModalBody nem található!");
        return;
    }
    
    modalBody.innerHTML = "";

    if (!db) {
        modalBody.innerHTML = "<p class='text-center'>Adatbázis nem elérhető.</p>";
        currentModal = modalEl;
        new bootstrap.Modal(modalEl).show();
        return;
    }

    try {
        const result = db.exec("SELECT * FROM favorites");
        const rows = result[0]?.values || [];

        if (rows.length === 0) {
            modalBody.innerHTML = `<p class='text-center'>${translations[currentLanguage]['no-favorites']}</p>`;
        } else {
            const grid = document.createElement("div");
            grid.style.display = "grid";
            grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
            grid.style.gap = "20px";

            rows.forEach(row => {
                const [id, title, thumbnail, genre, platform] = row;
                const div = document.createElement("div");
                div.className = "favorite-card";
                div.innerHTML = `
                    <img src="${thumbnail}" style="width:100%; height:120px; object-fit:cover; border-radius:8px 8px 0 0;">
                    <div class="fav-content">
                        <h6>${title}</h6>
                        <small>${genre}</small><br>
                        <small class="text-muted">${platform}</small>
                        <div class="fav-actions mt-2">
                            <button class="btn btn-sm btn-info view-game" data-title="${title}">
                                <i>👁</i> ${currentLanguage === 'sk' ? 'Zobraziť' : currentLanguage === 'en' ? 'View' : 'Megnéz'}
                            </button>
                            <button class="btn btn-sm btn-danger remove-game" data-id="${id}" data-title="${title}" data-confirm-state="false">
                                <i>🗑</i> ${currentLanguage === 'sk' ? 'Vymazať' : currentLanguage === 'en' ? 'Remove' : 'Törlés'}
                            </button>
                        </div>
                    </div>
                `;
                
                // View gomb - megnyitja a játék modal-t
                div.querySelector('.view-game').onclick = (e) => {
                    e.stopPropagation();
                    const game = allGames.find(g => g.title === title);
                    if (game) {
                        closeCurrentModal();
                        openGameModal(game);
                    }
                };
                
                // Remove gomb - kétlépcsős törlés
                const removeBtn = div.querySelector('.remove-game');
                let timeoutId = null;
                
                removeBtn.onclick = (e) => {
                    e.stopPropagation();
                    const isConfirmState = removeBtn.dataset.confirmState === 'true';
                    
                    if (!isConfirmState) {
                        // Első kattintás - megerősítés kérése
                        removeBtn.innerHTML = `${translations[currentLanguage]['btn-confirm-remove']}`;
                        removeBtn.className = 'btn btn-sm btn-outline-danger remove-game';
                        removeBtn.dataset.confirmState = 'true';
                        
                        // Töröljük az előző timeout-ot, ha van
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        
                        // 3 másodperc múlva visszaáll az eredeti állapotba
                        timeoutId = setTimeout(() => {
                            removeBtn.innerHTML = `${currentLanguage === 'sk' ? 'Vymazať' : currentLanguage === 'en' ? 'Remove' : 'Törlés'}`;
                            removeBtn.className = 'btn btn-sm btn-danger remove-game';
                            removeBtn.dataset.confirmState = 'false';
                            timeoutId = null;
                        }, 3000);
                    } else {
                        // Második kattintás - törlés
                        if (timeoutId) {
                            clearTimeout(timeoutId);
                        }
                        
                        const stmtDelete = db.prepare("DELETE FROM favorites WHERE id = ?");
                        stmtDelete.run([id]);
                        stmtDelete.free();
                        showToast(`✓ ${title} ${translations[currentLanguage]['toast-removed']}`, 'info');
                        openFavoritesModal(); // Frissítjük a listát
                    }
                };
                
                grid.appendChild(div);
            });
            
            modalBody.appendChild(grid);
        }
    } catch (e) {
        console.error("Hiba a kedvencek betöltésekor:", e);
        modalBody.innerHTML = "<p class='text-center text-danger'>Hiba történt a kedvencek betöltésekor.</p>";
    }

    currentModal = modalEl;
    new bootstrap.Modal(modalEl).show();
}

// ─── Init ─────────────────────────────────────────────
window.addEventListener("load", () => {
    // Nyelv alkalmazása
    changeLanguage(currentLanguage);
    
    setTimeout(() => {
        loadGames();
    }, 500);
    
    // Infinite scroll setup
    setupInfiniteScroll();
    
    // Modal bezárás event listener - biztonsági védelem
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', () => {
            // Ha a modal bezárult, töröljük az esetleges maradék backdrop-okat
            setTimeout(() => {
                document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
                    backdrop.remove();
                });
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 100);
        });
    });
});

// ─── Infinite Scroll Observer ─────────────────────────────────────────
function setupInfiniteScroll() {
    // Observer a lap aljának figyelésére
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && displayedGames < filteredGames.length) {
                loadMoreGames();
            }
        });
    }, {
        root: null,
        rootMargin: '200px', // 200px-el az alján lévő elem előtt töltse be
        threshold: 0.1
    });
    
    // Sentinel elem létrehozása ami a lista végén van
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    
    const container = document.getElementById('games');
    container.parentElement.appendChild(sentinel);
    
    observer.observe(sentinel);
    
    // Görgetés esemény alternatív megoldásként (fallback)
    window.addEventListener('scroll', () => {
        if (isLoading || displayedGames >= filteredGames.length) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        
        // Ha az oldal aljához közel vagyunk (300px-en belül)
        if (scrollTop + clientHeight >= scrollHeight - 300) {
            loadMoreGames();
        }
    }, { passive: true });
}

document.getElementById("searchInput").addEventListener("input", filterAndSortGames);
document.getElementById("platformSelect").addEventListener("change", filterAndSortGames);
document.getElementById("categorySelect").addEventListener("change", filterAndSortGames);
document.getElementById("sortSelect").addEventListener("change", filterAndSortGames);
