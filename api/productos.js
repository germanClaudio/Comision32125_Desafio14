// const ContenedorMemoria = require('../contenedores/ContenedorMemoria.js')
const { generarProducto } = require ('../utils/generadorDeProductos.js')
//import { generarId } from '../utils/generadorDeIds.js'
const ContainerArchivo = require('../daos/productos/ProductosDaoArchivo.js')


class ApiProductosMock extends ContainerArchivo {
   constructor() { super() }

   async popular(cant = 5) {
       const nuevos = []
       for (let i = 0; i < cant; i++) {
           const nuevoProducto = generarProducto(i)
           const guardado = await this.createProduct(nuevoProducto)
           nuevos.push(guardado)
        }
        return nuevos
   }
}

module.exports = ApiProductosMock