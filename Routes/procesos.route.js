const { Router } = require('express')
const procesosRouter = Router()

const port = process.env.PORT //process.argv.slice(2)[0]
const mode = process.env.MODE//process.argv.slice(2)[1]
const numCPUs = require('os').cpus().length
const date = new Date().toLocaleString()

procesosRouter.get('/', (req, res) => {
    
    res.send(`  Servidor express NGINX en puerto: ${port} <br><br>
    PID: ${process.pid}<br><br>
    Numero de CPUs: ${numCPUs}<br><br>
    MODO: ${mode}<br><br>
    Fecha y Hora: ${date}`)
})

module.exports = {
     procesosRouter
} 