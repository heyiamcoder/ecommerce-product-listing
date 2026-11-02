const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, "..", "database", "ecommerce.db");
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

const asyncDb = {
  all(sql, params = []) {
    return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => db.get(sql, params, (err, row) => err ? reject(err) : resolve(row)));
  }
};

app.get("/api/health", (_req, res) => res.json({ status: "ok", message: "E-commerce API is running" }));

// GET /api/products?search=phone&category=Electronics
app.get("/api/products", async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
    if (search.length > 100 || category.length > 60) {
      return res.status(400).json({ error: "Search must be at most 100 characters and category at most 60 characters." });
    }
    let sql = "SELECT id, name, description, price, image_url, category, stock FROM products WHERE 1=1";
    const params = [];
    if (search) {
      sql += " AND (name LIKE ? OR description LIKE ? OR category LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (category && category.toLowerCase() !== "all") {
      sql += " AND category = ?";
      params.push(category);
    }
    sql += " ORDER BY id";
    const products = await asyncDb.all(sql, params);
    res.status(200).json({ count: products.length, products });
  } catch (error) {
    console.error("GET /api/products:", error);
    res.status(500).json({ error: "Unable to retrieve products." });
  }
});

// GET /api/products/:id
app.get("/api/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "Product ID must be a positive integer." });
  try {
    const product = await asyncDb.get("SELECT id, name, description, price, image_url, category, stock FROM products WHERE id = ?", [id]);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    console.error("GET /api/products/:id:", error);
    res.status(500).json({ error: "Unable to retrieve product." });
  }
});

// Friendly fallback for unknown API routes.
app.use("/api", (_req, res) => res.status(404).json({ error: "API endpoint not found." }));

app.listen(PORT, () => console.log(`E-commerce app running at http://localhost:${PORT}`));
