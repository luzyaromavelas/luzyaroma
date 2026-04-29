let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// =========================
// 💾 GUARDAR
// =========================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// =========================
// 🛒 MOSTRAR CARRITO
// =========================
function mostrarCarrito() {
  const tabla = document.querySelector("#tabla-carrito tbody");
  const totalHTML = document.getElementById("total-carrito");

  if (!tabla || !totalHTML) return;

  tabla.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    tabla.innerHTML = "<tr><td colspan='4'>Carrito vacío</td></tr>";
    totalHTML.textContent = "Total: $0";
    return;
  }

  carrito.forEach((p, i) => {

    const cantidad = p.cantidad || 1;
    const precio = p.precio || 0;
    const subtotal = cantidad * precio;

    total += subtotal;

    const imagen = p.imagen || "../assets/logo.jpg";

    tabla.innerHTML += `
      <tr>
        <td>
          <img src="${imagen}" style="width:60px; border-radius:8px;"><br>
          ${p.nombre || "Producto"}
        </td>

        <td>
          <select onchange="cambiarCantidad(${i}, this.value)">
            ${[1,2,3,4,5,6,7,8,9,10].map(n =>
              `<option ${n == cantidad ? "selected" : ""}>${n}</option>`
            ).join("")}
          </select>
        </td>

        <td>
          <textarea onchange="guardarNota(${i}, this.value)">${p.notas || ""}</textarea>
        </td>

        <td>
          <button onclick="eliminar(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  totalHTML.textContent = "Total: $" + total;
}

// =========================
// 🔄 ACCIONES
// =========================
function cambiarCantidad(i, v) {
  const val = Number(v);
  if (val < 1) return;

  carrito[i].cantidad = val;
  guardarCarrito();
  mostrarCarrito();
}

function guardarNota(i, v) {
  carrito[i].notas = v || "";
  guardarCarrito();
}

function eliminar(i) {
  carrito.splice(i, 1);
  guardarCarrito();
  mostrarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
}

// =========================
// 🔢 CONTADOR HEADER
// =========================
function actualizarContador() {
  const link = document.getElementById("link-carrito");
  if (!link) return;

  const total = carrito.reduce((a, p) => a + (p.cantidad || 0), 0);
  link.textContent = `Carrito (${total})`;
}

// =========================
// 📲 WHATSAPP (ESTABLE Y SIN ERRORES)
// =========================
window.generarEnlaceWhatsApp = function () {

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let nombre = prompt("Tu nombre:");
  let direccion = prompt("Dirección de entrega:");

  if (!nombre || !direccion) return;

  let mensaje = "PEDIDO LUZ Y AROMA\n\n";
  let total = 0;

  carrito.forEach(p => {

    const cantidad = p.cantidad || 1;
    const precio = p.precio || 0;
    const subtotal = cantidad * precio;

    total += subtotal;

    mensaje += "Producto: " + (p.nombre || "") + "\n";
    mensaje += "Cantidad: " + cantidad + "\n";
    mensaje += "Subtotal: $" + subtotal + "\n";

    if (p.notas) {
      mensaje += "Notas: " + p.notas + "\n";
    }

    mensaje += "\n";
  });

  mensaje += "TOTAL: $" + total + "\n\n";
  mensaje += "Nombre: " + nombre + "\n";
  mensaje += "Direccion: " + direccion;

  const telefono = "5493456541139";

  const url = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(mensaje);

  // ✔ redirección segura (NO bloquea popups)
  window.location.href = url;
};

// =========================
// 🚀 INIT
// =========================
document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
  actualizarContador();

  const btn = document.getElementById("vaciar-carrito");
  if (btn) btn.addEventListener("click", vaciarCarrito);
});