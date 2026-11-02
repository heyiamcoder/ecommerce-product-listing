# ShopEase — Full-Stack E-Commerce (Part 1)

A responsive product listing website built for the **Lab Assignment: Building a Full-Stack E-Commerce Application, Part 1**.

## Technology
- Frontend: HTML5, CSS3 and vanilla JavaScript
- Backend: Node.js and Express
- Database: SQLite (relational SQL database)
- API: REST-style JSON endpoints

## Requirements covered
- Product catalogue showing name, description, price and image
- Individual product details view
- Search by product name, description or category
- Category filtering
- Express backend with input validation and HTTP status codes
- SQLite product table, schema and sample product data
- Frontend retrieves catalogue/details through backend APIs
- Local setup instructions and screenshots

## Prerequisites
Install:
1. Node.js 18 or later (npm is included)
2. A modern browser

Check installation:
```bash
node --version
npm --version
```

## Run locally

1. Download or clone this repository.
2. Open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Initialize the SQLite database and insert sample products:
   ```bash
   npm run db:init
   ```
5. Start the application:
   ```bash
   npm start
   ```
6. Open **http://localhost:3000** in your browser.

The database file `database/ecommerce.db` is created automatically by the initialization command. The server expects this database file to exist.

### Initialize database (manual alternative)
If you do not use the npm script, run:
```bash
node backend/init-db.js
```
To reset the sample data, delete `database/ecommerce.db` and run the initialization command again.

## API documentation

Base URL: `http://localhost:3000`

| Method | Endpoint | Description | Success | Error examples |
|---|---|---|---|---|
| GET | `/api/health` | API health check | 200 | — |
| GET | `/api/products` | Retrieve all products | 200 | 400, 500 |
| GET | `/api/products?search=phone` | Search products | 200 | 400, 500 |
| GET | `/api/products?category=Electronics` | Filter by category | 200 | 400, 500 |
| GET | `/api/products/:id` | Retrieve one product | 200 | 400, 404, 500 |

### Example responses
`GET /api/products`:
```json
{
  "count": 1,
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "Comfortable over-ear headphones...",
      "price": 2499,
      "image_url": "https://...",
      "category": "Electronics",
      "stock": 24
    }
  ]
}
```

`GET /api/products/1` returns one product object. Invalid IDs return HTTP 400; a valid but unknown ID returns HTTP 404.

## Database design

Table: `products`

| Column | Type | Constraints |
|---|---|---|
| id | INTEGER | Primary key, auto increment |
| name | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| price | REAL | NOT NULL, >= 0 |
| image_url | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| stock | INTEGER | NOT NULL, default 0, >= 0 |
| created_at | DATETIME | Defaults to current timestamp |

SQL scripts are in `database/schema.sql` and `database/seed.sql`. The initializer is `backend/init-db.js`.

## Architecture

```text
Browser (HTML / CSS / JavaScript)
              |
              | HTTP fetch / JSON
              v
       Express REST API
       /api/products
       /api/products/:id
              |
              | SQL queries
              v
        SQLite database
         products table
```

The browser never reads the database directly. It requests product data from Express, and Express queries SQLite and returns JSON.

## Project structure

```text
ecommerce-product-listing/
├── backend/
│   ├── init-db.js
│   └── server.js
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── screenshots/
│   ├── product-listing.png
│   └── product-details.png
├── .gitignore
├── package.json
└── README.md
```

## Screenshots

See the `screenshots/` folder for product listing and product details reference screenshots.

## Upload to GitHub

```bash
git init
git add .
git commit -m "Complete Part 1 e-commerce product listing"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL.

## Notes
- Product photos are loaded from Unsplash URLs, so an internet connection is needed to display those images.
- The application itself and its API run locally.
- This is Part 1 only; cart, login, authorization, migrations, logging and monitoring are outside this part's stated scope.


### Run the app after setup
The screenshots are visual reference captures for the submitted interface. For a live demonstration, start the server and open the local URL above.
