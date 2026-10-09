const WA_NUMBER = "27710331241";
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.getElementById("categoryFilters");
const noResults = document.getElementById("noResults");
const count = document.getElementById("catalogueCount");
let activeCategory = "All";

function whatsappLink(productName) {
  const message = `Hello, I am interested in ordering ${productName}. Please provide more information about the price, availability, and delivery.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}
function makeFilters() {
  const categories = ["All", ...new Set(window.PRODUCTS.map(p => p.category))];
  categoryFilters.innerHTML = categories.map(cat =>
    `<button class="filter-button ${cat === activeCategory ? "active" : ""}" type="button" data-category="${cat}">${cat}</button>`
  ).join("");
  categoryFilters.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      makeFilters();
      renderProducts();
    });
  });
}
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = window.PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-image">
        <span class="product-tag">PRODUCT ${String(p.id).padStart(2,"0")}</span>
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${p.image.replace(/\.(jpg|jpeg|png|webp)$/i,'.jpg')}'">
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom"><span class="price">Price on request</span>
          <a class="order-button" href="${whatsappLink(p.name)}" target="_blank" rel="noopener">ORDER ON WHATSAPP ↗</a>
        </div>
      </div>
    </article>`).join("");
  noResults.hidden = filtered.length > 0;
  count.textContent = `${filtered.length} PRODUCTS`;
}
searchInput.addEventListener("input", renderProducts);
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();
makeFilters();
renderProducts();
