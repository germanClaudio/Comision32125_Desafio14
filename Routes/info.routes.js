const { Router } = require('express')
const infoRouter = Router()
const parseArgs = require('minimist')

const options = require('../options/config')

const { fork } = require('child_process')
const path = require('path')

//---------------- Process object -----------------
const args = parseArgs(process.argv.slice(2))
const host = options.options.HOST
const direc = process.cwd()
const idProcess = process.pid
const nodeVersion = process.versions
const title = process.title
const os = process.platform
const memoryUse = process.memoryUsage()
const ruta = process.argv[1]
const port = process.argv.slice(2)[0]
const mode = process.argv.slice(2)[1]
const numCPUs = require('os').cpus().length

infoRouter.get('/info', (req, res) => {
    // console.log('args: ', args, host, direc, idProcess, nodeVersion, title, os, memoryUse)
    res.json({
        Argumentos: args,
        Mode: mode,
        Numero_Procesadores: numCPUs,
        Ruta: ruta,
        Host: host,
        Port: port,
        Carpeta: direc,
        Process_ID: idProcess,
        Node_Version: nodeVersion,
        Path_ejecion: title, 
        Operative_System: os,
        Memory_Use: memoryUse,
    })
})


infoRouter.get('/api/randoms', (req, res) => {

    const maxCount = 10000
    const cant = parseInt(req.query.cant) || maxCount

    const forked = fork(path.resolve(__dirname, '../utils/computo.js'), [cant])
    
    if (cant <= maxCount) {
        forked.on('message', (msg) => { 
            logger.info('Returning api/randoms result: ', {Mensaje: msg})  
            //console.log('Returning api/randoms result: ', {Mensaje: msg})
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end( msg )
        })
        forked.send('start')
    
    } else {
        //  console.log(`What you are trying to do... kill your CPU by computing ${cant} randon numbers?`)
         res.json({ Mensaje: `What you are trying to do... kill your CPU by computing ${cant} randon numbers?`})
    }
})

module.exports = {
     infoRouter
} 