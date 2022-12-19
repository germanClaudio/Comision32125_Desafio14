const { Router } = require('express')
const { authMiddleware } = require('../middlewares/auth.middleware')
// const { checkAtuhentication } = require('../middlewares/chekAuthentication')
const Products = require('../daos/productos/ProductosDaoArchivo') //'../services/productos.js'

const routerfProductos = Router()
const products = new Products()

const checkAtuhentication = (req, res, next) => {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) return next();
    res.redirect("/api/auth/login");
}

routerfProductos.get('/', checkAtuhentication, (req, res) => {
    // console.log(req.session.visits)
    // const productos = new Products
    const productos = products.getAllProducts()//getProducts()
    if(productos.error) res.status(200).json({msg: 'No hay productos cargados'}) 
    res.render('index.ejs' , { username: req.session.user, visitas: req.session.visits })
    //res.status(200).json(productos)
})

routerfProductos.get('/:id', (req, res) => {
    // const productos = new Products
    const producto = products.getById(req.params.id) //getProductById
    if(producto.error) res.status(404).json({msg: 'Producto no encontrado'})
    res.status(200).json( producto )
})

routerfProductos.post('/', (req, res) => {
    // const productos = new Products
    console.log(req.body)
    const producto = products.createProduct(req.body) //addProduct
    res.status(201).json(producto)
})

// routerfProductos.put('/:id', (req, res) => {
//     // const productos = new Products
//     const producto = products.updateProduct(req.params.id, req.body)
//     res.status(200).json(producto)
// })

routerfProductos.delete('/:id', (req, res) => {
    // const productos = new Products
    const producto = products.deleteProduct(req.params.id)
    res.status(200).json(producto)
})

module.exports = routerfProductos