const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "..", "database", "ecommerce.db");
const schema = fs.readFileSync(path.join(__dirname, "..", "database", "schema.sql"), "utf8");
const seed = fs.readFileSync(path.join(__dirname, "..", "database", "seed.sql"), "utf8");

const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.exec(schema, error => {
    if (error) { console.error("Schema error:", error.message); process.exitCode = 1; db.close(); return; }
    db.run("DELETE FROM products", error2 => {
      if (error2) { console.error("Reset error:", error2.message); process.exitCode = 1; db.close(); return; }
      db.exec(seed, error3 => {
        if (error3) { console.error("Seed error:", error3.message); process.exitCode = 1; }
        else console.log("Database initialized and sample products inserted.");
        db.close();
      });
    });
  });
});