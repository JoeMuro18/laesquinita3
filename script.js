// ===================================================
// BASE DE DATOS Y VARIABLES GLOBALES DEL CARRITO
// ===================================================
let productosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
let contador = productosCarrito.length;

const precios = {
    "Hamburguesa de Pollo": 5,
    "Hamburguesa de Carne": 5,
    "Salchipapa": 6,
    "Alita Broster": 8,
    "Pierna Broster": 9,
    "Encuentro Broster": 9,
    "Pecho Broster": 10,
    "Combo Broster": 19,
    "Combo Parrillero": 15,
    "Combo Familiar": 68,
    "Combo Amigos": 12
};

// ===================================================
// FUNCIONES GENERALES DEL CARRITO DE COMPRAS
// ===================================================
function agregarCarrito(nombreProducto) {
    contador++;

    const contadorElemento = document.getElementById("contador");
    if (contadorElemento) {
        contadorElemento.textContent = contador;
    }

    productosCarrito.push(nombreProducto);
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    actualizarCarrito();

    const mensaje = document.getElementById("mensaje-carrito");
    if (mensaje) {
        mensaje.style.backgroundColor = ""; 
        mensaje.style.border = "";
        mensaje.style.color = "";
        mensaje.style.animation = "";
        
        mensaje.textContent = "✅ " + nombreProducto + " agregado al carrito";
        mensaje.classList.add("mostrar");
        setTimeout(function() {
            mensaje.classList.remove("mostrar");
        }, 2500);
    }
}

function agregarHamburguesaPersonalizada() {
    const selector = document.getElementById("tipoHamburguesa");
    if (selector) {
        const hamburguesaSeleccionada = selector.value; 
        agregarCarrito(hamburguesaSeleccionada); 
    }
}

function abrirCarrito() {
    const panel = document.getElementById("panel-carrito");
    if (panel) {
        panel.classList.toggle("mostrar-carrito");
    }
}

function cerrarCarrito() {
    const panel = document.getElementById("panel-carrito");
    if (panel) {
        panel.classList.remove("mostrar-carrito");
    }
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-productos");
    const subtotalElemento = document.getElementById("subtotal");
    const totalElemento = document.getElementById("total");

    if (!lista) return;

    lista.innerHTML = "";
    let subtotal = 0;

    if (productosCarrito.length === 0) {
        lista.innerHTML = '<p class="carrito-vacio">No hay productos agregados</p>';
        if (subtotalElemento) subtotalElemento.textContent = "S/ 0.00";
        if (totalElemento) totalElemento.textContent = "S/ 5.00";
        return;
    }

    productosCarrito.forEach(function(producto, index) {
        let precioIndividual = 0;
        
        for (const base in precios) {
            if (producto.startsWith(base)) {
                precioIndividual = precios[base];
                break;
            }
        }
        
        subtotal += precioIndividual;

        let nombreProductoBase = producto;
        let textoCremas = "";

        if (producto.includes("(")) {
            const partes = producto.split("(");
            nombreProductoBase = partes[0].trim(); 
            textoCremas = "(" + partes[1].trim(); 
            textoCremas = textoCremas.replace(/\+/g, ", ");
        }

        lista.innerHTML += `
            <div class="producto-carrito" style="
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                padding: 12px 15px; 
                margin: 8px 5px; 
                background: #fff; 
                border-radius: 12px; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.08); 
                box-sizing: border-box;
                width: calc(100% - 10px);
            ">
                <div style="display: flex; flex-direction: column; text-align: left; max-width: 85%; min-width: 0;">
                    <span style="font-size: 14px; font-weight: 700; color: #111; line-height: 1.2;">
                        ${nombreProductoBase}
                    </span>
                    ${textoCremas ? `
                    <span style="font-size: 11.5px; font-weight: 500; color: #666; margin-top: 4px; line-height: 1.3; word-break: break-word;">
                        ${textoCremas}
                    </span>` : ''}
                </div>
                
                <button class="btn-eliminar" onclick="eliminarProducto(${index})" style="
                    background: none; 
                    border: none; 
                    cursor: pointer; 
                    font-size: 15px; 
                    color: #ff4d4d; 
                    padding: 5px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    ✕
                </button>
            </div>
        `;
    });

    if (subtotalElemento) subtotalElemento.textContent = "S/ " + subtotal.toFixed(2);
    const total = subtotal + 5;
    if (totalElemento) totalElemento.textContent = "S/ " + total.toFixed(2);
}

function eliminarProducto(index) {
    contador--;
    if (contador < 0) {
        contador = 0;
    }

    productosCarrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));

    const contadorElemento = document.getElementById("contador");
    if (contadorElemento) {
        contadorElemento.textContent = productosCarrito.length;
    }

    actualizarCarrito();
}

// ===================================================
// LÓGICA DE CONTROL PARA EL MÓDULO DE RESERVAS
// ===================================================
function mostrarReserva() {
    const mensaje = document.getElementById("mensaje-reserva");
    if (mensaje) {
        mensaje.classList.add("mostrar");
        setTimeout(function() {
            mensaje.classList.remove("mostrar");
        }, 3000);
    }
}

const fechaReserva = document.getElementById("fechaReserva");
if (fechaReserva) {
    const hoy = new Date();
    const fechaMinima = hoy.toISOString().split("T")[0];
    fechaReserva.min = fechaMinima;
    fechaReserva.max = "2026-12-31";
}

// ===================================================
// LÓGICA DINÁMICA: SISTEMA DE RESEÑAS CON ESTRELLAS (MODIFICADO)
// ===================================================

// SE ELIMINÓ LA FUNCIÓN AUTOMÁTICA QUE INYECTABA LAS RESEÑAS DE PRUEBA DE LA NADA

function cargarResenas() {
    const gridComentarios = document.getElementById("grid-comentarios");
    if (!gridComentarios) return; 

    // Ahora lee directo lo que haya en memoria sin forzar registros de demostración
    const listaResenas = JSON.parse(localStorage.getItem("sistemaResenasEsquinita")) || [];

    gridComentarios.innerHTML = "";

    if (listaResenas.length === 0) {
        gridComentarios.innerHTML = '<p style="text-align:center; color:#666; width:100%;">No hay reseñas registradas por el momento.</p>';
        return;
    }

    listaResenas.forEach(function(item) {
        const estrellasTexto = "★".repeat(item.puntuacion) + "☆".repeat(5 - item.puntuacion);

        gridComentarios.innerHTML += `
            <div class="comentario-card ${item.color || 'rojo'}">
                <div class="comentario-header">
                    <div class="avatar"><i class="fa-regular fa-user"></i></div>
                    <div>
                        <h4>${item.usuario}</h4>
                        <div class="stars-card" style="color: #f1df22; font-size: 14px;">${estrellasTexto}</div>
                    </div>
                </div>
                <p>"${item.comentario}"</p>
            </div>
        `;
    });
}

// ===================================================
// EVENTO UNIFICADO DE INICIALIZACIÓN DE PÁGINA
// ===================================================
window.onload = function() {
    const contadorElemento = document.getElementById("contador");
    if (contadorElemento) {
        contadorElemento.textContent = productosCarrito.length;
    }

    actualizarCarrito();
    cargarResenas();
};

// ===================================================
// CONTROL DEL MODAL DE PAGO YAPE/PLIN CON WHATSAPP
// ===================================================
function abrirModalPago() {
    if (productosCarrito.length === 0) {
        const mensaje = document.getElementById("mensaje-carrito");
        if (mensaje) {
            mensaje.style.backgroundColor = "#d12c42";
            mensaje.style.border = "2px solid #000";
            mensaje.style.color = "#fff";
            
            mensaje.textContent = "⚠️ Tu carrito está vacío. ¡Agrega una delicia antes de pagar!";
            mensaje.classList.add("mostrar");
            
            cerrarCarrito();

            setTimeout(function() {
                mensaje.classList.remove("mostrar");
            }, 3500);
        }
        return;
    }
    
    const modalPago = document.getElementById("modal-pago");
    if (modalPago) {
        modalPago.style.display = "flex";
        modalPago.style.justifyContent = "center";
        modalPago.style.alignItems = "center";
    }
}

function cerrarModalPago() {
    const modalPago = document.getElementById("modal-pago");
    if (modalPago) {
        modalPago.style.display = "none";
    }
}

function enviarPedidoWhatsApp() {
    const numeroCliente = document.getElementById("pagoNumero").value.trim();
    const codigoOperacion = document.getElementById("pagoCodigo").value.trim();
    const direccionEntrega = document.getElementById("pagoDireccion").value;
    const nombreCliente = document.getElementById("pagoNombre").value.trim();

    let subtotal = 0;
    productosCarrito.forEach(function(producto) {
        let precioIndividual = 0;
        for (const base in precios) {
            if (producto.startsWith(base)) {
                precioIndividual = precios[base];
                break;
            }
        }
        subtotal += precioIndividual;
    });
    const costoDelivery = 5.00;
    const totalPagar = subtotal + costoDelivery;

    const conteoProductos = {};
    productosCarrito.forEach(producto => {
        conteoProductos[producto] = (conteoProductos[producto] || 0) + 1;
    });

    let listaDetallada = "";
    let listaResumidaVendedor = [];
    for (const [producto, cantidad] of Object.entries(conteoProductos)) {
        listaDetallada += `• ${cantidad}x ${producto}\n`;
        listaResumidaVendedor.push(`${cantidad}x ${producto}`);
    }
    const stringProductosVendedor = listaResumidaVendedor.join(" / ");

    const pedidoParaVendedor = {
        id: "pedido-" + Date.now(),
        productos: stringProductosVendedor,
        direccion: direccionEntrega,
        cliente: nombreCliente,
        telefono: numeroCliente,
        fecha: new Date().toLocaleDateString('es-PE'),
        total: totalPagar,
        monto: totalPagar,
        precio: totalPagar,
        subtotal: totalPagar 
    };

    let pedidosTotales = JSON.parse(localStorage.getItem("pedidosEsquinita")) || [];
    pedidosTotales.push(pedidoParaVendedor);
    localStorage.setItem("pedidosEsquinita", JSON.stringify(pedidosTotales));

    const mensajeWhatsApp = 
`🍔 *NUEVO PEDIDO - LA ESQUINITA.PE* 🍔

*DATOS DEL CLIENTE:*
👤 *Nombre:* ${nombreCliente}
📞 *Celular:* ${numeroCliente}
📍 *Dirección:* ${direccionEntrega}

*DETALLE DEL PEDIDO:*
${listaDetallada}
💵 *Subtotal:* S/ ${subtotal.toFixed(2)}
🛵 *Delivery:* S/ ${costoDelivery.toFixed(2)}
💰 *TOTAL PAGADO:* S/ ${totalPagar.toFixed(2)}

*PAGO TRANSFERIDO:*
📲 *Método:* Yape / Plin
🔢 *Código de Operación:* ${codigoOperacion}

_¡Muchas gracias por su compra! Por favor confirme la recepción del pago._`;

    const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
    const numeroWhatsAppDestino = "51932925818"; 
    
    window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsAppDestino}&text=${mensajeCodificado}`, '_blank');

    productosCarrito = [];
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
    contador = 0;
    const contadorElemento = document.getElementById("contador");
    if (contadorElemento) contadorElemento.textContent = "0";
    
    actualizarCarrito();
    cerrarModalPago();
    cerrarCarrito();
    
    document.getElementById("form-final-pago").reset();
}

function validarZonaCercana() {
    const selector = document.getElementById("selectZonaDelivery");
    const alerta = document.getElementById("alertaDistancia");
    const btnEnviar = document.getElementById("btnEnviarPedido");

    if (!selector || !btnEnviar) return;

    if (selector.value === "lejos") {
        alerta.style.display = "block"; 
        btnEnviar.disabled = true;       
        btnEnviar.style.background = "#ccc"; 
        btnEnviar.style.borderColor = "#777"; 
        btnEnviar.style.cursor = "not-allowed"; 
        btnEnviar.style.boxShadow = "none";    
    } else {
        alerta.style.display = "none";  
        btnEnviar.disabled = false;      
        btnEnviar.style.background = "#f1df22"; 
        btnEnviar.style.borderColor = "#000";
        btnEnviar.style.cursor = "pointer";
        btnEnviar.style.boxShadow = "3px 3px 0px #000"; 
    }
}