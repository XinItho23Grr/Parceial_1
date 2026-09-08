let productos = [
  {
    "id": 1,
    "nombre": "PC Gamer Ryzen 5 5600G - 16GB - 500GB SSD",
    "precio": 681707,
    "categoria": "Computadores",
    "marca": "AMD CORP",
    "especificaciones": [
      "Sistema operativo: Windows 11 Pro",
      "Velocidad de procesamiento: 4.4 GHz",
      "Memoria RAM: 16GB DDR4",
      "Procesador: AMD Ryzen 5 5600G",
      "Almacenamiento: 500GB SSD NVMe"
    ],
    "imagenes": [
      "./img/pc/pc.jpg",
      "./img/pc/pc2.jpg",
      "./img/pc/pc3.jpg"
    ]
  },
  {
    "id": 2,
    "nombre": "Mouse Gamer 16000 DPI RGB",
    "precio": 29990,
    "categoria": "Periféricos",
    "marca": "LOGITECH",
    "especificaciones": [
      "Sensor óptico de alta precisión 16000 DPI",
      "Iluminación RGB Lightsync programable",
      "6 botones configurables",
      "Cable trenzado de alta durabilidad"
    ],
    "imagenes": [
      "./img/mouse/mouse.jpg",
      "./img/mouse/mouse2.jpg",
      "./img/mouse/mouse3.jpg"
    ]
  },
  {
    "id": 3,
    "nombre": "Audífonos Gamer RGB 7.1 Surround",
    "precio": 45990,
    "categoria": "Periféricos",
    "marca": "HYPERX",
    "especificaciones": [
      "Sonido envolvente 7.1 virtual",
      "Micrófono desmontable con cancelación de ruido",
      "Almohadillas de espuma viscoelástica",
      "Conexión USB y Jack 3.5mm"
    ],
    "imagenes": [
      "./img/audifonos/audifonos.jpg",
      "./img/audifonos/audifonos2.jpg",
      "./img/audifonos/audifonos3.jpg"
    ]
  },
  {
    "id": 4,
    "nombre": "Teclado Mecánico RGB Switches Red",
    "precio": 54990,
    "categoria": "Periféricos",
    "marca": "REDRAGON",
    "especificaciones": [
      "Switches mecánicos Red (Silenciosos y rápidos)",
      "Retroiluminación RGB por tecla",
      "Estructura de aluminio reforzado",
      "Tecnología Anti-Ghosting en todas las teclas"
    ],
    "imagenes": [
      "./img/teclado/teclado.jpg",
      "./img/teclado/teclado2.jpg",
      "./img/teclado/teclado3.jpg"
    ]
  },
  {
    "id": 5,
    "nombre": "Monitor Gamer 24\" 165Hz 1ms IPS",
    "precio": 159900,
    "categoria": "Monitores",
    "marca": "ASUS",
    "especificaciones": [
      "Tasa de refresco: 165Hz",
      "Tiempo de respuesta: 1ms MPRT",
      "Panel IPS Full HD (1920x1080)",
      "Compatibilidad con AMD FreeSync Premium"
    ],
    "imagenes": [
      "./img/monitor/monitor.jpg",
      "./img/monitor/monitor2.jpg",
      "./img/monitor/monitor3.jpg"
    ]
  },
  {
    "id": 6,
    "nombre": "Silla Gamer Ergonómica Reclinable",
    "precio": 129990,
    "categoria": "Accesorios",
    "marca": "COUGAR",
    "especificaciones": [
      "Reclinable hasta 180°",
      "Cojines lumbar y cervical incluidos",
      "Pistón de gas Clase 4 (soporta hasta 120kg)",
      "Reposabrazos con ajuste 2D"
    ],
    "imagenes": [
      "./img/silla/silla.jpg",
      "./img/silla/silla2.jpg",
      "./img/silla/silla3.jpg"
    ]
  }
];

let carrito = JSON.parse(localStorage.getItem("cart_nikapro")) || [];
let currentImageIndex = {};
let autoPlayIntervals = {};

document.addEventListener("DOMContentLoaded", async () => {
  actualizarContadorCarrito();
  actualizarInterfazUsuario();

  try {
    const res = await fetch("productos.json");
    if (res.ok) {
      productos = await res.json();
    }
  } catch (e) {
    console.warn("Cargando productos locales.");
  }

  if (document.getElementById("products-container")) {
    renderizarProductos(productos);
    iniciarCarruselAutomatico(productos);
  }

  if (document.getElementById("product-detail-content")) {
    cargarDetalleProducto();
  }

  if (document.getElementById("cart-items")) {
    renderizarCarrito();
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email-input").value;
      localStorage.setItem("usuario_logeado", JSON.stringify({ email: email }));

      const redirect = sessionStorage.getItem("redirect_after_login");
      if (redirect) {
        sessionStorage.removeItem("redirect_after_login");
        window.location.href = redirect;
      } else {
        window.location.href = "index.html";
      }
    });
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const termino = e.target.value.toLowerCase().trim();
      const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
      );
      renderizarProductos(filtrados);
      iniciarCarruselAutomatico(filtrados);
    });
  }
});

function usuarioEstaAutenticado() {
  return localStorage.getItem("usuario_logeado") !== null;
}

function cerrarSesion() {
  localStorage.removeItem("usuario_logeado");
  window.location.reload();
}

function actualizarInterfazUsuario() {
  const userContainer = document.querySelector(".user-actions");
  if (!userContainer) return;

  const userLink = userContainer.querySelector(".user-link");
  if (usuarioEstaAutenticado() && userLink) {
    const user = JSON.parse(localStorage.getItem("usuario_logeado"));
    userLink.outerHTML = `
      <span style="color: #38bdf8; font-size: 0.9rem; font-weight: 600;">👋 ${user.email.split('@')[0]}</span>
      <button onclick="cerrarSesion()" class="btn-danger" style="padding: 4px 8px; font-size: 0.8rem; margin-left: 5px; background: #ef4444; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Salir</button>
    `;
  }
}

function guardarCarrito() {
  localStorage.setItem("cart_nikapro", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const cartCounts = document.querySelectorAll(".cart-count");
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  cartCounts.forEach(el => el.textContent = totalItems);
}

function agregarAlCarrito(idProducto, cantidad = 1) {
  const prod = productos.find(p => p.id === idProducto);
  if (!prod) return;

  const existe = carrito.find(item => item.id === idProducto);
  if (existe) {
    existe.cantidad += cantidad;
  } else {
    carrito.push({
      id: prod.id,
      nombre: prod.nombre,
      precio: prod.precio,
      imagen: prod.imagenes[0],
      cantidad: cantidad
    });
  }

  guardarCarrito();
  mostrarModal("¡Producto Agregado!", `"${prod.nombre}" se añadió al carrito.`);
}

function renderizarProductos(lista) {
  const container = document.getElementById("products-container");
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #94a3b8;">No se encontraron productos.</p>`;
    return;
  }

  container.innerHTML = lista.map(p => {
    if (currentImageIndex[p.id] === undefined) {
      currentImageIndex[p.id] = 0;
    }

    return `
      <div class="product-card">
        <div class="carousel-wrapper" onclick="verDetalle(${p.id})">
          <img id="img-prod-${p.id}" src="${p.imagenes[currentImageIndex[p.id]]}" alt="${p.nombre}" class="product-img">
        </div>
        <h3 onclick="verDetalle(${p.id})">${p.nombre}</h3>
        <div class="price" onclick="verDetalle(${p.id})">$${p.precio.toLocaleString("es-CL")}</div>
        <button type="button" class="btn-primary" onclick="agregarAlCarrito(${p.id})">Agregar 🛒</button>
      </div>
    `;
  }).join("");
}

function iniciarCarruselAutomatico(lista) {
  Object.keys(autoPlayIntervals).forEach(id => clearInterval(autoPlayIntervals[id]));
  autoPlayIntervals = {};

  lista.forEach(p => {
    if (p.imagenes && p.imagenes.length > 1) {
      autoPlayIntervals[p.id] = setInterval(() => {
        let indexActual = currentImageIndex[p.id] || 0;
        indexActual = (indexActual + 1) % p.imagenes.length;
        currentImageIndex[p.id] = indexActual;

        const imgElement = document.getElementById(`img-prod-${p.id}`);
        if (imgElement) {
          imgElement.src = p.imagenes[indexActual];
        }
      }, 3500);
    }
  });
}

function verDetalle(id) {
  window.location.href = `detalle.html?id=${id}`;
}

function cargarDetalleProducto() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  const container = document.getElementById("product-detail-content");

  const prod = productos.find(p => p.id === id);

  if (!prod || !container) {
    if (container) container.innerHTML = `<p style="color: #94a3b8; text-align: center; width: 100%;">Producto no encontrado.</p>`;
    return;
  }

  const specsHTML = (prod.especificaciones || [])
    .map(spec => `<li>${spec}</li>`).join("");

  const thumbsHTML = prod.imagenes
    .map((img, idx) => `<img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="seleccionarImagenDetalle(${prod.id}, '${img}', this)">`)
    .join("");

  container.innerHTML = `
    <div class="thumbnails-col">
      ${thumbsHTML}
    </div>
    <div class="main-image-col">
      ${prod.imagenes.length > 1 ? `<button type="button" class="carousel-btn prev" onclick="cambiarImagenDetalle(${prod.id}, -1)">&#10094;</button>` : ''}
      <img id="img-detail-main" src="${prod.imagenes[0]}" alt="${prod.nombre}">
      ${prod.imagenes.length > 1 ? `<button type="button" class="carousel-btn next" onclick="cambiarImagenDetalle(${prod.id}, 1)">&#10095;</button>` : ''}
    </div>
    <div class="info-col">
      <span class="brand">${prod.marca || 'NIKA PRO'}</span>
      <h1>${prod.nombre}</h1>
      <div class="price">$${prod.precio.toLocaleString("es-CL")}</div>
      
      <div class="quantity-wrapper">
        <label>Cantidad:</label>
        <input type="number" id="detail-quantity" value="1" min="1" max="10">
      </div>

      <button type="button" class="btn-primary" onclick="agregarDesdeDetalle(${prod.id})">Agregar al Carro 🛒</button>

      <ul class="specs-list">
        ${specsHTML || '<li>Sin especificaciones adicionales.</li>'}
      </ul>

      <div class="shipping-box">
        <div class="shipping-item">📦 Envíos a todo el país</div>
        <div class="shipping-item">🏪 Retiro disponible en tienda</div>
      </div>
    </div>
  `;

  currentImageIndex[prod.id] = 0;
}

function seleccionarImagenDetalle(idProducto, src, elem) {
  document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
  elem.classList.add('active');
  document.getElementById('img-detail-main').src = src;
}

function cambiarImagenDetalle(idProducto, direccion) {
  const prod = productos.find(p => p.id === idProducto);
  if (!prod || !prod.imagenes) return;

  let indexActual = currentImageIndex[idProducto] || 0;
  indexActual = (indexActual + direccion + prod.imagenes.length) % prod.imagenes.length;
  currentImageIndex[idProducto] = indexActual;

  const mainImg = document.getElementById('img-detail-main');
  if (mainImg) mainImg.src = prod.imagenes[indexActual];

  const thumbs = document.querySelectorAll('.thumb-img');
  thumbs.forEach((t, i) => t.classList.toggle('active', i === indexActual));
}

function agregarDesdeDetalle(idProducto) {
  const cant = parseInt(document.getElementById('detail-quantity').value) || 1;
  agregarAlCarrito(idProducto, cant);
}

function renderizarCarrito() {
  const tbody = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("btn-checkout");
  if (!tbody) return;

  if (carrito.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8;">Tu carrito está vacío.</td></tr>`;
    if (totalEl) totalEl.textContent = "$0";
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let total = 0;
  tbody.innerHTML = carrito.map((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    return `
      <tr>
        <td>${item.nombre}</td>
        <td>$${item.precio.toLocaleString("es-CL")}</td>
        <td>${item.cantidad}</td>
        <td>$${subtotal.toLocaleString("es-CL")}</td>
        <td><button type="button" class="btn-danger" style="padding: 6px 12px; font-size: 0.8rem; background: #ef4444; color: #fff; border: none; border-radius: 4px; cursor: pointer;" onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
      </tr>
    `;
  }).join("");

  if (totalEl) totalEl.textContent = `$${total.toLocaleString("es-CL")}`;
}

function finalizarCompra() {
  if (carrito.length === 0) {
    mostrarModal("Carrito Vacío", "Agrega productos antes de finalizar la compra.");
    return;
  }

  if (!usuarioEstaAutenticado()) {
    sessionStorage.setItem("redirect_after_login", "carrito.html");
    window.location.href = "login.html";
    return;
  }

  vaciarCarrito();
  mostrarModal("¡Compra Exitosa!", "Gracias por tu compra. Tu pedido se ha procesado correctamente.");
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("cart_nikapro");
  actualizarContadorCarrito();
  renderizarCarrito();
}

function mostrarModal(titulo, mensaje) {
  const modal = document.getElementById("modal-notification");
  if (!modal) return;
  document.getElementById("modal-title").textContent = titulo;
  document.getElementById("modal-message").textContent = mensaje;
  modal.classList.remove("hidden");
}

function cerrarModal() {
  const modal = document.getElementById("modal-notification");
  if (modal) modal.classList.add("hidden");
}
