// Productos integrados para evitar errores de CORS con file:/// y GitHub Pages
const products = [
  {
    id: 1,
    nombre: "Audífonos Gamer RGB",
    precio: 119990,
    imagenes: [
      "img/audifonos/audifonos.jpg",
      "img/audifonos/audifonos2.jpg",
      "img/audifonos/audifonos3.jpg"
    ]
  },
  {
    id: 2,
    nombre: "Monitor Gaming 144Hz",
    precio: 79990,
    imagenes: [
      "img/monitor/monitor.jpg",
      "img/monitor/monitor2.jpg",
      "img/monitor/monitor3.jpg"
    ]
  },
  {
    id: 3,
    nombre: "Mouse Óptico Ergonómico",
    precio: 16999,
    imagenes: [
      "img/mouse/mouse.jpg",
      "img/mouse/mouse2.jpg",
      "img/mouse/mouse3.jpg"
    ]
  },
  {
    id: 4,
    nombre: "PC Desktop Gamer High-End",
    precio: 3290990,
    imagenes: [
      "img/pc/pc.jpg",
      "img/pc/pc2.jpg",
      "img/pc/pc3.jpg"
    ]
  },
  {
    id: 5,
    nombre: "Teclado Mecánico RGB",
    precio: 17999,
    imagenes: [
      "img/teclado/teclado.jpg",
      "img/teclado/teclado2.jpg",
      "img/teclado/teclado3.jpg"
    ]
  },
  {
    id: 6,
    nombre: "Silla Gamer Cougar Armor Titan Pro Extra Ancha",
    precio: 249990,
    categoria: "Accesorios",
    marca: "COUGAR",
    especificaciones: [
      "Soporta hasta 160 kg",
      "Reclinación 170° con bloqueo de ángulo",
      "Estructura de acero y gamuza de alta resistencia",
      "Reposabrazos con ajustes 4D"
    ],
    imagenes: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600"
    ]
  },
  {
    id: 7,
    nombre: "Procesador Intel Core Ultra 9 285K 24-Cores 5.7GHz",
    precio: 649990,
    categoria: "Componentes",
    marca: "INTEL",
    especificaciones: [
      "24 Núcleos (8 P-Cores + 16 E-Cores)",
      "Frecuencia máxima Turbo: 5.7 GHz",
      "Socket LGA1851",
      "Unidad NPU integrada para Inteligencia Artificial"
    ],
    imagenes: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600"
    ]
  },
  {
    id: 8,
    nombre: "Refrigeración Líquida Corsair iCUE Link 360mm LCD",
    precio: 219990,
    categoria: "Componentes",
    marca: "CORSAIR",
    especificaciones: [
      "Pantalla IPS LCD personalizable de 2.1 pulgadas",
      "Tres ventiladores QX120 RGB conectables en cadena",
      "Bomba de alto flujo ultra silenciosa"
    ],
    imagenes: [
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600"
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const isHomePage = !window.location.pathname.includes('/pages/');
  // En la home mostramos los 8 productos del mockup (2 filas x 4 columnas)
  const displayProducts = isHomePage ? products.slice(0, 8) : products;

  renderCatalog(displayProducts);
  setupSearch(products);
  renderProductDetail(products);

  updateCartCount();
  setupModal();
  renderCartView();
  setupNewsletter();
});

// Función para resolver la ruta exacta de la imagen según la ubicación
function fixImagePath(imagePath) {
  if (!imagePath) return 'https://via.placeholder.com/300?text=Sin+Imagen';
  
  // Si es un enlace de internet (https://), se respeta intacto
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const isPagesFolder = window.location.pathname.includes('/pages/');
  
  // Limpia diagonal inicial si existe para evitar doble barra
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  return isPagesFolder ? `../${cleanPath}` : cleanPath;
}

// Modal Global
function showModal(title, message) {
  const overlay = document.getElementById("modalOverlay");
  if (!overlay) return;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  overlay.classList.add("active");
}

function setupModal() {
  const closeBtn = document.getElementById("modalClose");
  const overlay = document.getElementById("modalOverlay");
  if (closeBtn && overlay) {
    closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
  }
}


function renderCatalog(items) {
  const grid = document.getElementById("productGrid") || document.getElementById("featuredProductsContainer");
  if (!grid) return;

  grid.innerHTML = "";
  items.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    
    const mainImg = product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : '';
    const finalImgSrc = fixImagePath(mainImg);

    const detailLink = window.location.pathname.includes('/pages/') 
      ? `producto-detalle.html?id=${product.id}` 
      : `pages/producto-detalle.html?id=${product.id}`;

    const fallbackImage = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600';

    card.innerHTML = `
      <a href="${detailLink}" style="text-decoration: none; color: inherit;">
        <img src="${finalImgSrc}" alt="${product.nombre}" onerror="this.onerror=null; this.src='${fallbackImage}';">
        <h4>${product.nombre}</h4>
      </a>
      <div class="product-card-footer">
        <span class="attribute">${product.categoria || 'Accesorios'}</span>
        <span class="price">$${product.precio.toLocaleString("es-CL")}</span>
      </div>
      <button class="btn" onclick="addToCart(${product.id}, '${product.nombre.replace(/'/g, "\\'")}', ${product.precio})">
        Agregar al Carrito
      </button>
    `;
    grid.appendChild(card);
  });
}

// Buscador
function setupSearch(items) {
  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");
  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      searchDropdown.style.display = "none";
      return;
    }

    const matches = items.filter(p => p.nombre.toLowerCase().includes(query));
    if (matches.length === 0) {
      searchDropdown.style.display = "none";
      return;
    }

    searchDropdown.innerHTML = matches.map(p => `
      <div style="padding: 10px; border-bottom: 1px solid #334155; cursor: pointer; color: #fff;" onclick="selectProduct('${p.nombre.replace(/'/g, "\\'")}')">
        ${p.nombre} - <strong>$${p.precio.toLocaleString("es-CL")}</strong>
      </div>
    `).join("");
    searchDropdown.style.display = "block";
  });
}

function selectProduct(name) {
  showModal("Producto Encontrado", `Has seleccionado: ${name}`);
  const searchDropdown = document.getElementById("searchDropdown");
  if (searchDropdown) searchDropdown.style.display = "none";
}

// Vista Detallada de Producto
function renderProductDetail(items) {
  const container = document.getElementById("productDetailContainer");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idParam = parseInt(urlParams.get("id")) || 1;
  const product = items.find(p => p.id === idParam) || items[0];

  if (!product) return;

  const mainImgSrc = fixImagePath(product.imagenes[0]);
  const fallbackImage = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600';

  const thumbnailsHtml = product.imagenes.map((img, idx) => `
    <img src="${fixImagePath(img)}" 
         alt="Vista ${idx + 1}" 
         style="width: 70px; height: 70px; object-fit: cover; cursor: pointer; border: 2px solid #334155; border-radius: 4px;" 
         onerror="this.onerror=null; this.src='${fallbackImage}';"
         onclick="document.getElementById('mainDetailImage').src=this.src">
  `).join('');

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 15px;">
      <img id="mainDetailImage" src="${mainImgSrc}" alt="${product.nombre}" 
           style="width: 320px; height: 320px; object-fit: contain; background: #fff; padding: 10px; border-radius: 8px;"
           onerror="this.onerror=null; this.src='${fallbackImage}';">
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        ${thumbnailsHtml}
      </div>
    </div>
    <div class="blog-card-content" style="width: auto; max-width: 500px;">
      <h2 style="color: #fff; margin-bottom: 15px;">${product.nombre}</h2>
      <p style="font-size: 1.5rem; color: #60a5fa; font-weight: bold; margin-bottom: 15px;">$${product.precio.toLocaleString("es-CL")}</p>
      <p style="color: #94a3b8; margin-bottom: 20px;">Producto oficial NIKA PRO disponible con despacho inmediato a todo Chile.</p>
      <button class="btn" onclick="addToCart(${product.id}, '${product.nombre.replace(/'/g, "\\'")}', ${product.precio})">Agregar al Carrito</button>
    </div>
  `;
}

// Carrito
function getCart() {
  return JSON.parse(localStorage.getItem("nika_cart")) || [];
}

function addToCart(id, name, price) {
  const cart = getCart();
  cart.push({ id, name, price });
  localStorage.setItem("nika_cart", JSON.stringify(cart));
  updateCartCount();
  showModal("¡Añadido!", `${name} se agregó al carrito.`);
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    const cart = getCart();
    countEl.textContent = cart.length;
  }
}

function renderCartView() {
  const cartList = document.getElementById("cartItemsList");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartList || !cartTotal) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartList.innerHTML = "<p style='color: #94a3b8; text-align: center; padding: 20px;'>El carrito está vacío.</p>";
    cartTotal.textContent = "0";
    return;
  }

  let total = 0;
  cartList.innerHTML = "";
  cart.forEach((item, index) => {
    total += item.price;
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
      <span style="color: #fff; font-weight: 500;">${item.name}</span>
      <div>
        <span style="color: #60a5fa; font-weight: bold; margin-right: 15px;">$${item.price.toLocaleString("es-CL")}</span>
        <button class="btn-danger" onclick="removeFromCart(${index})">Eliminar</button>
      </div>
    `;
    cartList.appendChild(row);
  });

  cartTotal.textContent = total.toLocaleString("es-CL");

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      localStorage.removeItem("nika_cart");
      updateCartCount();
      renderCartView();
      showModal("¡Compra Exitosa!", "Gracias por tu compra en NIKA PRO.");
    };
  }
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem("nika_cart", JSON.stringify(cart));
  updateCartCount();
  renderCartView();
}

// Suscripción al Newsletter del Footer
function setupNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletterEmail");
    if (emailInput && emailInput.value) {
      showModal("Suscripción exitosa", `Gracias por suscribirte con: ${emailInput.value}`);
      emailInput.value = "";
    }
  });
}