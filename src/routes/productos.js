const { Router } = require('express');
const multer = require('multer')

const routerProductos = Router();
const Contenedor = require("../Contenedor")
const inventario =new Contenedor('productos.txt')


/* ------------------------------------------------------ */

// GET '/api/productos' -> devuelve todos los productos.
routerProductos.get('/', async (req, res) => {
    const array = await inventario.getAll();
    res.json(array);
});

async function mdwObtenerProducto(req, res, next){
  const { id } = req.params
  req.producto = await inventario.getById(id)
  next()
}
function mdwValidarProducto(req, res, next){
  if( req.producto == undefined ) {
    res.status(404).json( {error : 'producto no encontrado'} )
  } 
  next()
}

// GET '/api/productos/:id' -> devuelve un producto según su id.
routerProductos.get('/:id', mdwObtenerProducto, mdwValidarProducto, (req, res, next) => {
  res.json(req.producto) }
);

// POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id asignado.
routerProductos.post('/', async (req, res) => {
    let producto = req.body
    const id = await inventario.save(producto)
    producto = await inventario.getById(id)
    res.json(producto)
});

// PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
routerProductos.put('/:id', async (req, res) => {
    const { id } = req.params
    let data = req.body

    await inventario.update(id, data)
    const producto = await inventario.getById(id)
    res.json(producto)
});

// DELETE '/api/productos/:id' -> elimina un producto según su id.
routerProductos.delete('/:id', async (req, res) => {
    const {id} = req.params
    await inventario.deleteById(id)
    res.json({borrado:"Ok"})
});

/* ------------------------------------------------------ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'archivos')
  },
  filename: function (req, file, cb) {
    cb(null, 'productos.txt')
  }
})

const upload = multer({ storage })

routerProductos.post('/subir', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }
    res.send(file)
  })
  

exports.routerProductos = routerProductos;