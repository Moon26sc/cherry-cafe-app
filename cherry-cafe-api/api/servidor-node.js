
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PUERTO = 8000;
const ARCHIVO_DB = path.join(__dirname, 'db.json');

/* ---------- Utilidades de contraseña (sin librerías externas) ---------- */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return salt + ':' + hash;
}
function verificarPassword(password, guardado) {
  const [salt, hash] = String(guardado).split(':');
  const calculado = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculado, 'hex'));
}

/* ---------- Base de datos en archivo JSON ---------- */
function datosIniciales() {
  const prod = (id, nombre, descripcion, precio, categoria, imagen, tamanio) =>
    ({ id, nombre, descripcion, precio, tamanio, disponible: true, categoria, imagen });
  return {
    contadores: { producto: 16, usuario: 2, pedido: 0 },
    productos: [
      prod(1, 'Espresso', 'Café concentrado de cuerpo intenso.', 6.0, 'Cafés', 'assets/img/espresso.jpg', 'Pequeño'),
      prod(2, 'Cappuccino', 'Espresso con leche vaporizada y espuma cremosa.', 9.5, 'Cafés', 'assets/img/cappuccino.jpg', 'Mediano'),
      prod(3, 'Latte', 'Café suave con abundante leche texturizada.', 10.0, 'Cafés', 'assets/img/latte.jpg', 'Grande'),
      prod(4, 'Chai Latte', 'Té especiado con leche caliente.', 11.0, 'Bebidas calientes', 'assets/img/chai.jpg', 'Mediano'),
      prod(5, 'Chocolate Caliente', 'Chocolate espeso con crema batida.', 10.5, 'Bebidas calientes', 'assets/img/chocolate.jpg', 'Mediano'),
      prod(6, 'Té Cherry', 'Infusión de frutos rojos de la casa.', 7.0, 'Bebidas calientes', 'assets/img/te.jpg', 'Mediano'),
      prod(7, 'Infusión Herbal', 'Mezcla de hierbas naturales.', 6.5, 'Bebidas calientes', 'assets/img/infucion.jpeg', 'Mediano'),
      prod(8, 'Cold Brew', 'Café infusionado en frío por 12 horas.', 12.0, 'Bebidas frías', 'assets/img/cold.jpg', 'Grande'),
      prod(9, 'Frappé Caramelo', 'Café helado batido con caramelo.', 14.0, 'Bebidas frías', 'assets/img/frappe.jpg', 'Grande'),
      prod(10, 'Frappé Vainilla', 'Bebida helada cremosa de vainilla.', 13.5, 'Bebidas frías', 'assets/img/vainilla.jpg', 'Grande'),
      prod(11, 'Cheesecake', 'Porción de cheesecake con frutos rojos.', 15.0, 'Postres', 'assets/img/Cheesecake.jpg', 'Porción'),
      prod(12, 'Brownie', 'Brownie de chocolate tibio.', 9.0, 'Postres', 'assets/img/Brownie.jpg', 'Porción'),
      prod(13, 'Alfajor', 'Alfajor artesanal con manjar blanco.', 5.0, 'Postres', 'assets/img/alfajor.jpg', 'Unidad'),
      prod(14, 'Croissant', 'Croissant de mantequilla recién horneado.', 8.0, 'Acompañamientos', 'assets/img/croissant.jpg', 'Unidad'),
      prod(15, 'Bagel', 'Bagel con queso crema.', 9.5, 'Acompañamientos', 'assets/img/bagel.jpg', 'Unidad'),
      prod(16, 'Tostada con Palta', 'Pan artesanal con palta y huevo.', 12.5, 'Acompañamientos', 'assets/img/tostada.jpg', 'Unidad'),
    ],
    usuarios: [
      { id_usuario: 1, nombre: 'Administrador', email: 'admin@cherrycafe.com', password: hashPassword('admin123'), rol: 'ADMIN' },
      { id_usuario: 2, nombre: 'Cliente Demo', email: 'cliente@cherrycafe.com', password: hashPassword('cliente123'), rol: 'CLIENTE' },
    ],
    clientes: [{ id_usuario: 2, puntos_fidelidad: 0 }],
    pedidos: [],
    items_pedido: [],
    pagos: [],
  };
}

let db;
function cargarDB() {
  if (!fs.existsSync(ARCHIVO_DB)) {
    db = datosIniciales();
    guardarDB();
    console.log('db.json creado con datos de ejemplo.');
  } else {
    db = JSON.parse(fs.readFileSync(ARCHIVO_DB, 'utf8'));
  }
}
function guardarDB() {
  fs.writeFileSync(ARCHIVO_DB, JSON.stringify(db, null, 2), 'utf8');
}

/* ---------- Helpers HTTP ---------- */
function responder(res, codigo, cuerpo) {
  res.writeHead(codigo, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  });
  res.end(JSON.stringify(cuerpo));
}
function leerCuerpo(req) {
  return new Promise((resolve) => {
    let texto = '';
    req.on('data', (parte) => (texto += parte));
    req.on('end', () => {
      try { resolve(texto ? JSON.parse(texto) : {}); } catch { resolve({}); }
    });
  });
}

/* ---------- Endpoints (mismos nombres que los .php) ---------- */
function productos(metodo, query, datos, res) {
  const id = Number(query.get('id'));
  switch (metodo) {
    case 'GET':
      return responder(res, 200, [...db.productos].sort((a, b) => b.id - a.id));
    case 'POST': {
      db.contadores.producto += 1;
      db.productos.push({
        id: db.contadores.producto,
        nombre: datos.nombre,
        descripcion: datos.descripcion || '',
        precio: Number(datos.precio),
        tamanio: datos.tamanio || 'Mediano',
        disponible: !!datos.disponible,
        categoria: datos.categoria || 'Cafés',
        imagen: datos.imagen || 'assets/img/cherrycafe.jpeg',
      });
      guardarDB();
      return responder(res, 200, { mensaje: 'Producto creado.' });
    }
    case 'PUT':
    case 'PATCH': {
      const p = db.productos.find((x) => x.id === id);
      if (!p) return responder(res, 404, { mensaje: 'Producto no encontrado.' });
      for (const campo of ['nombre', 'descripcion', 'categoria', 'imagen']) {
        if (datos[campo] !== undefined) p[campo] = datos[campo];
      }
      if (datos.precio !== undefined) p.precio = Number(datos.precio);
      if (datos.disponible !== undefined) p.disponible = !!datos.disponible;
      guardarDB();
      return responder(res, 200, {
        mensaje: metodo === 'PUT' ? 'Producto actualizado.' : 'Producto modificado parcialmente.',
      });
    }
    case 'DELETE':
      db.productos = db.productos.filter((x) => x.id !== id);
      guardarDB();
      return responder(res, 200, { mensaje: 'Producto eliminado.' });
    default:
      return responder(res, 405, { mensaje: 'Método no permitido.' });
  }
}

function auth(metodo, query, datos, res) {
  if (!datos.accion) {
    return responder(res, 400, { mensaje: 'Acción no especificada (login o registro).' });
  }
  if (datos.accion === 'registro') {
    if (db.usuarios.some((u) => u.email === datos.email)) {
      return responder(res, 409, { mensaje: 'El correo ya está registrado.' });
    }
    db.contadores.usuario += 1;
    const id = db.contadores.usuario;
    db.usuarios.push({ id_usuario: id, nombre: datos.nombre, email: datos.email, password: hashPassword(datos.password), rol: 'CLIENTE' });
    db.clientes.push({ id_usuario: id, puntos_fidelidad: 0 });
    guardarDB();
    return responder(res, 201, { mensaje: 'Cuenta creada exitosamente.' });
  }
  if (datos.accion === 'login') {
    const u = db.usuarios.find((x) => x.email === datos.email);
    if (!u) return responder(res, 404, { mensaje: 'No existe una cuenta con ese correo.' });
    if (!verificarPassword(datos.password, u.password)) {
      return responder(res, 401, { mensaje: 'Contraseña incorrecta.' });
    }
    const { password, ...usuario } = u;
    return responder(res, 200, { mensaje: 'Login exitoso', usuario });
  }
  return responder(res, 400, { mensaje: 'Acción no válida.' });
}

function pedidos(metodo, query, datos, res) {
  if (!datos.items || !datos.items.length || !datos.total) {
    return responder(res, 400, { mensaje: 'Datos del pedido incompletos.' });
  }
  db.contadores.pedido += 1;
  const id_pedido = db.contadores.pedido;
  const id_cliente = datos.id_cliente != null ? Number(datos.id_cliente) : null;
  db.pedidos.push({
    id_pedido,
    id_cliente,
    fecha: new Date().toISOString(),
    estado: 'PENDIENTE',
    tipo_entrega: datos.tipo_entrega || 'TIENDA',
    total: Number(datos.total),
  });
  for (const item of datos.items) {
    db.items_pedido.push({
      id_pedido,
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_unitario: Number(item.precio),
      subtotal: item.cantidad * Number(item.precio),
    });
  }
  db.pagos.push({ id_pedido, monto: Number(datos.total), metodo: datos.metodo_pago || 'TARJETA', estado: 'COMPLETADO' });
  if (id_cliente != null) {
    const cli = db.clientes.find((c) => c.id_usuario === id_cliente);
    if (cli) cli.puntos_fidelidad += Math.floor(Number(datos.total));
  }
  guardarDB();
  return responder(res, 201, { mensaje: 'Pedido procesado exitosamente.', id_pedido });
}

function misPedidos(metodo, query, datos, res) {
  const idCliente = query.get('id_cliente');
  if (!idCliente) return responder(res, 200, { mensaje: 'Falta el ID del cliente' });
  const lista = db.pedidos
    .filter((p) => p.id_cliente === Number(idCliente))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .map((p) => ({
      id_pedido: p.id_pedido,
      fecha: p.fecha,
      estado: p.estado,
      tipo_entrega: p.tipo_entrega,
      total: p.total,
      items: db.items_pedido
        .filter((i) => i.id_pedido === p.id_pedido)
        .map((i) => {
          const prod = db.productos.find((x) => x.id === i.id_producto);
          return {
            cantidad: i.cantidad,
            precio_unitario: i.precio_unitario,
            subtotal: i.subtotal,
            nombre: prod ? prod.nombre : 'Producto eliminado',
          };
        }),
    }));
  return responder(res, 200, lista);
}

function pedidosAdmin(metodo, query, datos, res) {
  const lista = [...db.pedidos]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 15)
    .map((p) => {
      const u = db.usuarios.find((x) => x.id_usuario === p.id_cliente);
      return { id: p.id_pedido, cliente: u ? u.nombre : 'Cliente Anónimo', total: p.total, estado: p.estado };
    });
  return responder(res, 200, lista);
}

const RUTAS = {
  '/api/productos.php': productos,
  '/api/auth.php': auth,
  '/api/pedidos.php': pedidos,
  '/api/mis_pedidos.php': misPedidos,
  '/api/pedidos_admin.php': pedidosAdmin,
};

/* ---------- Servidor ---------- */
cargarDB();
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'OPTIONS') return responder(res, 200, {});
    const manejador = RUTAS[url.pathname];
    if (!manejador) return responder(res, 404, { mensaje: 'Ruta no encontrada: ' + url.pathname });
    const datos = await leerCuerpo(req);
    try {
      manejador(req.method, url.searchParams, datos, res);
    } catch (error) {
      console.error(error);
      responder(res, 500, { mensaje: 'Error interno: ' + error.message });
    }
  })
  .listen(PUERTO, () => {
    console.log('API de Cherry Café lista en http://localhost:' + PUERTO);
    console.log('Admin: admin@cherrycafe.com / admin123');
    console.log('Cliente: cliente@cherrycafe.com / cliente123');
  });
