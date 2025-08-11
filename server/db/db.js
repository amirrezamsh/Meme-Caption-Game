const sqlite = require("sqlite3");
const path = require("path");

// Path to the database file
const dbPath = path.join(__dirname, "db.db");

// The database is created and the foreign keys are enabled.
const db = (Database = new sqlite.Database(dbPath, (err) => {
  if (err) throw err;
  db.run("PRAGMA foreign_keys = ON");
}));

module.exports = db;
