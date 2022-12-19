const { option } = require('./config')

const knex = require('knex')(option.sqlite)

knex.schema.createTable('productos', table => {
    table.increments('id')
    table.string('marca')
    table.string('modelo')
    table.integer('anio')
} )
.then(() => console.log('Tabla creada'))
.catch((err) => { console.log(err); throw err })
.finally(() => knex.destroy())