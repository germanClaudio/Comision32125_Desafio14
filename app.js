const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const initServer = require("./server")

const config = require("./options/config.js")

const app = initServer()
const PORT = config.options.PORT //process.argv.slice(2)[0] || 4000
const MODE = config.options.MODE //process.argv.slice(2)[1] || FORK

// console.log('CPU: ',numCPUs)
// console.log("mode: ", process.argv.slice(2)[1])

const logger = require('./utils/winston.js')

if (MODE == "CLUSTER" && cluster.isPrimary) {
        logger.info(`Primary process --> ${process.pid}`)
        logger.info(`Mode: ${MODE}`)
        logger.info(`Escuchando en el puerto ${PORT}`)
        logger.info(`Numero de CPUs: ${numCPUs}`)

        // console.log(`Primary process --> ${process.pid}`)
        // console.log(`Mode: ${MODE}`)
        // console.log(`Escuchando en el puerto ${PORT}`)
        // console.log(`Numero de CPUs: ${numCPUs}`)

        for (let i=0; i < 4; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, coder, signal) => {
            logger.info('Worker: ',worker.process.pid, 'died', new Date().toLocaleString())
            cluster.fork()
        })
    

} else {
        process.on('exit', code => {
            logger.warn(`Salida con codigo de error: : ${code}`)
            // console.log(`Salida con codigo de error: : ${code}`)
        })

        try {
            app.listen(PORT)
            logger.info(`Process ID: #${process.pid} - Escuchando en el puerto ${PORT}`)
            logger.info(`Worker ${process.pid} started`)
            logger.info(`Mode: ${MODE}`)
            logger.info(`Numero de CPUs: ${numCPUs}`)
            
            //console.log(`Process ID: #${process.pid} - Escuchando en el puerto ${PORT}`)
            // console.log(`Worker ${process.pid} started`)
            // console.log(`Mode: ${MODE}`)
            // console.log(`Numero de CPUs: ${numCPUs}`)
            
        } catch (error) {
            logger.error("Error en Server: ',error")
            //console.log('Error en Server: ',error)
        }
}

//////////////////////////////////////////////////////////////////////
// comandos para ejecutar
// node --prof server.js

// curl -X GET "http://localhost:4000/newUser?username=marian&password=qwerty123"
// artillery quick --count 20 -n 50 "http://localhost:4000/auth-bloq?username=marian&password=qwerty123" > result_bloq.txt

// curl -X GET "http://localhost:8080/newUser?username=dani&password=dani123"
// artillery quick --count 20 -n 50 "http://localhost:4000/auth-nobloq?username=dani&password=dani123" > result_nobloq.txt

// decodificar archivos log
// node --prof-process bloq-v8.log > result_prof_bloq.txt
// node --prof-process nobloq-v8.log > result_prof_nobloq.txt


// node --inspect server.js

//chrome://inspect

// El generador de perfiles se basa en el muestreo. Es decir, se despierta a
// intervalos regulares (ticks) y registra dónde está el puntero de instrucción. Si la
// IP apunta a una dirección que no se puede resolver en una función, la
// marca se informa como no contabilizada.

////////////////////////////////////////////////////////////////////////////




//pm2 ----------------------------------------------------------------
// pm2 start app.js --name="Server#1" --watch -- PORT
// pm2 start app.js --name="Server#2" --watch -- 8081
// pm2 start app.js --name="Server#3" --watch -- 8082


// pm2 start app.js --name="Server#3" --watch -i max -- 8083
// pm2 start app.js --name="Server#3" --watch -i 4 -- 8083


// tasklist /fi "imagename eq node.exe"
// taskkill /pid <PID> /f
// fuser <PORT>/tcp [-k]


// forever 
// forever start app.js
// forever list
// forever stop <PID>
// forever stopall

// pm2 modo fork 
//pm2 start app.js --name="Serverx" --watch -- PORT
//pm2 start app.js --name="Server1" --watch -- 8081
//pm2 start app.js --name="Server2" --watch -- 8082

//pm2 start app.js --name="Server3" --watch -i max -- 8083

