const ContainerMysql = require('../../contenedores/containerMysql')
const { options } = require('../../options/config.js')
const knex = require('knex')(options.mysql)

class ProductosDaoMysql extends ContainerMysql {
    constructor(configConnection) {
        super(options.mysql)
        this.table = options.mysql.connection.table
        this.knex = knex(configConnection)
    }

    async getAllProducts() {
        try {
            //console.log('knex: ',knex.from(this.table).select("*"))
            return await knex.from(this.table).select("*")
        } catch (error) {
            return new Error(`Error getting all products ${error}`)
        }
    }  
    
    async createProduct(addProduct) {
        const id = 0
        try {
            const result = await knex(this.table).insert( {id, ...addProduct } )
            console.log('Producto agregado: ', { id, ...addProduct } )
            return result
            
        } catch (error) {
            return new Error(`Error saving product ${error}`)
        }                
    }

    async getById(id) {
        try {
            return await knex.from(this.table).select('*').where('id', "=", parseInt(id))
        } catch (error) {
            return new Error(`Error getting one product ${error}`)
        }
    }

    async deleteProduct(id) {
        try {
            return await knex.from(this.table).where('id', "=", parseInt(id)).del()
        } catch (error) {
            return new Error(`Error deleting one product ${error}`)
        }
    }

    async updateProduct(id, producto) {
        try {
            return await knex.from(this.table).where('id', "=", parseInt(id)).update(producto)
        } catch (error) {
            return new Error(`Error updating one product ${error}`)
        }
    }

    async desconectar() {
    }
}

module.exports = ProductosDaoMysql

