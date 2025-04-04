// Recupera el carrito desde localStorage o crea uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function mostrarCarrito() {
    let tablaCarrito = document.querySelector("#tabla-carrito tbody");
    let totalCarrito = document.getElementById("total-carrito");

    if (!tablaCarrito || !totalCarrito) return; // Evitar errores si no existe la tabla

    tablaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        let fila = document.createElement("tr");

        // Nombre del producto
        let celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;
        fila.appendChild(celdaNombre);

        // Selector de cantidad
        let celdaCantidad = document.createElement("td");
        let selectCantidad = document.createElement("select");
        selectCantidad.classList.add("cantidad-select");

        for (let i = 1; i <= 10; i++) {
            let opcion = document.createElement("option");
            opcion.value = i;
            opcion.textContent = i;
            if (i == producto.cantidad) {
                opcion.selected = true;
            }
            selectCantidad.appendChild(opcion);
        }

        selectCantidad.addEventListener("change", () => {
            producto.cantidad = parseInt(selectCantidad.value);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });

        celdaCantidad.appendChild(selectCantidad);
        fila.appendChild(celdaCantidad);

        // Notas del producto
        let celdaNotas = document.createElement("td");
        let inputNotas = document.createElement("textarea");
        inputNotas.classList.add("input-notas");
        inputNotas.placeholder = "Ejemplo: Quiero en color rojo";
        inputNotas.value = producto.notas || "";

        inputNotas.addEventListener("input", () => {
            producto.notas = inputNotas.value;
            localStorage.setItem("carrito", JSON.stringify(carrito));
        });

        celdaNotas.appendChild(inputNotas);
        fila.appendChild(celdaNotas);

        // Botón de eliminar
        let celdaEliminar = document.createElement("td");
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "❌";
        botonEliminar.classList.add("eliminar-btn");
        botonEliminar.addEventListener("click", () => {
            carrito.splice(index, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });

        celdaEliminar.appendChild(botonEliminar);
        fila.appendChild(celdaEliminar);

        tablaCarrito.appendChild(fila);
        total += producto.precio * producto.cantidad;
    });

    totalCarrito.textContent = "Total: $" + total;
}

// Agregar productos al carrito
function agregarAlCarrito(nombre, precio) {
    let productoExistente = carrito.find(p => p.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1, notas: "" });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} agregado al carrito 🛒`);
}

// Agregar eventos a los botones "Agregar al Carrito"
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".agregar-carrito").forEach(boton => {
        boton.addEventListener("click", function () {
            let nombre = this.getAttribute("data-nombre");
            let precio = parseFloat(this.getAttribute("data-precio"));

            agregarAlCarrito(nombre, precio);
            mostrarCarrito();
        });
    });

    mostrarCarrito(); // Mostrar el carrito al cargar la página
});

// Genera el enlace de WhatsApp con el pedido
function generarEnlaceWhatsApp() {
    let mensaje = "Buenas!, quiero hacer un pedido:\n\n";

    carrito.forEach(producto => {
        mensaje += `🕯️ ${producto.nombre} - Cantidad: ${producto.cantidad}\n`;
        if (producto.notas.trim() !== "") {
            mensaje += `✍️ Notas: ${producto.notas}\n`;
        }
        mensaje += "\n";
    });

    mensaje += `💰 Total: $${document.getElementById("total-carrito").innerText.split(": $")[1]}`;
    let numeroWhatsApp = "5493456541139"; // Reemplaza con tu número de WhatsApp
    let enlace = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.location.href = enlace;
}