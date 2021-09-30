const { Router } = require('express');
const routerProductos = Router();

const Contenedor = require("../Contenedor")
const inventario =new Contenedor('productos.txt')

// GET '/api/productos' -> devuelve todos los productos.
routerProductos.get('/', async (req, res) => {
    const array = await inventario.getAll();
    res.json(array);
});

// GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get('/:id', async (req, res) => {
    const { id } = req.params
    const producto = await inventario.getById(id)
    res.json(producto)
});

// POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.

// DELETE '/api/productos/:id' -> elimina un producto según su id.

exports.routerProductos = routerProductos;