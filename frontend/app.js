const API = "/api";
const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const countLabel = document.getElementById("product-count");
const message = document.getElementById("message");
const modal = document.getElementById("product-modal");
const modalContent = document.getElementById("modal-content");

const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}

async function loadProducts() {
  message.textContent = "";
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (categoryFilter.value !== "All") params.set("category", categoryFilter.value);
  try {
    const response = await fetch(`${API}/products?${params.toString()}`);
    if (!response.ok) throw new Error("Could not load products.");
    const data = await response.json();
    countLabel.textContent = `${data.count} product${data.count === 1 ? "" : "s"}`;
    renderProducts(data.products);
  } catch (error) {
    grid.innerHTML = "";
    countLabel.textContent = "Products unavailable";
    message.textContent = `${error.message} Make sure the server is running.`;
  }
}

function renderProducts(products) {
  if (!products.length) {
    grid.innerHTML = '<p class="muted">No products match your search. Try another keyword or category.</p>';
    return;
  }
  grid.innerHTML = products.map(product => `
    <article class="product-card" data-id="${product.id}" tabindex="0" role="button" aria-label="View ${escapeHTML(product.name)} details">
      <div class="product-image"><img src="${escapeHTML(product.image_url)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.src='https://placehold.co/600x450/e9e7dd/365b45?text=ShopEase'"></div>
      <div class="product-info">
        <span class="category">${escapeHTML(product.category)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p>${escapeHTML(product.description)}</p>
        <div class="product-bottom"><span class="price">${money(product.price)}</span><button class="details-link" type="button" data-id="${product.id}">View details ↗</button></div>
      </div>
    </article>`).join("");
  grid.querySelectorAll("[data-id]").forEach(element => {
    element.addEventListener("click", () => showDetails(element.dataset.id));
    element.addEventListener("keydown", event => { if (event.key === "Enter") showDetails(element.dataset.id); });
  });
}

async function showDetails(id) {
  try {
    const response = await fetch(`${API}/products/${encodeURIComponent(id)}`);
    const product = await response.json();
    if (!response.ok) throw new Error(product.error || "Product not found.");
    modalContent.innerHTML = `
      <div class="detail-layout">
        <img src="${escapeHTML(product.image_url)}" alt="${escapeHTML(product.name)}" onerror="this.src='https://placehold.co/600x450/e9e7dd/365b45?text=ShopEase'">
        <div class="detail-copy"><span class="category">${escapeHTML(product.category)}</span>
          <h2 id="modal-title">${escapeHTML(product.name)}</h2>
          <p>${escapeHTML(product.description)}</p>
          <div class="detail-price">${money(product.price)}</div>
          <span class="stock">${product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}</span>
        </div>
      </div>`;
    modal.classList.remove("hidden");
  } catch (error) {
    message.textContent = error.message;
  }
}

let debounce;
searchInput.addEventListener("input", () => { clearTimeout(debounce); debounce = setTimeout(loadProducts, 250); });
categoryFilter.addEventListener("change", loadProducts);
document.getElementById("modal-close").addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", event => { if (event.target === modal) modal.classList.add("hidden"); });
document.addEventListener("keydown", event => { if (event.key === "Escape") modal.classList.add("hidden"); });

loadProducts();