function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function setCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
}

// 🔥 contador en header
function actualizarContador() {
  const carrito = getCarrito();
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);

  document.querySelectorAll("#link-carrito").forEach(el => {
    el.textContent = `Carrito (${total})`;
  });
}

// inicial
document.addEventListener("DOMContentLoaded", actualizarContador);