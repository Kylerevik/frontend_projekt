let db;

function initDatabase() {
    if (!window.initSqlJs) {
        console.error("initSqlJs nem elérhető!");
        return;
    }

    initSqlJs({
        locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
    }).then(SQL => {
        db = new SQL.Database();

        db.run(`
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                thumbnail TEXT,
                genre TEXT,
                platform TEXT
            )
        `);

        console.log("SQLite init kész");
        if (typeof loadFavorites === "function") loadFavorites();
    }).catch(err => {
        console.error("SQLite init error:", err);
    });
}

window.addEventListener("load", initDatabase);
