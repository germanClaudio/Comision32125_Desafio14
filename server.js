const express = require('express')
const session = require('express-session')
const path = require('path')
const crypto = require('crypto')

// const config = require('./options/config')

require('dotenv').config( {
    path: process.env.MODO === 'dev'
    ? path.resolve(__dirname, '.env')
    : path.resolve(__dirname, '.env')
 })

const cors = require('cors')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const routerfProductos = require('./Routes/productos.route.js')
const initSocket = require('./utils/initSocket.js')
const { infoRouter } = require('./Routes/info.routes.js')
const { authRouter } = require('./Routes/auth.routes.js')
const { procesosRouter } = require('./Routes/procesos.route.js')

//______________________________ mongo para session ______________________________ //
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

//________________________________________________________________________________ //
const passport = require('passport')
const { initPassport } = require('./middlewares/passport.js')
//________________________________________________________________________________ //

const compression = require('compression')

const logger = require('./utils/winston.js')

// const parseArgs = require('minimist')
// const args = parseArgs(process.argv.slice(2))
//     console.log('args: ', args)

////////////////////////////////////////////////////////////////
const users = {}
////////////////////////////////////////////////////////////////

const initServer = () => {    

    const app = express()
    const httpServer = new HttpServer(app)
    const io = new IOServer(httpServer)

    app.use(compression())
    app.use(cors())

    /////////////////////// configuracion de EJS /////////////////////////
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/public/views/pages') 

    //////////////  middleware  ///////////////////////
    // app.use(session({
    //     secret: process.env.SECRET_KEY_COOKIE,
    //     cookie: {
    //         httpOnly: false,
    //         secure: false,
    //         maxAge: 1000 * 60 * 60 * 24
    //     },
    //     rolling: true,
    //     resave: true,
    //     saveUninitialized: false
    // }))

    app.use(session({
        secret: process.env.SECRET_KEY_SESSION,    
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL_CONNECT,
            mongoOptions: advancedOptions,
        }),
        resave: true, 
        saveUninitialized: true
    }))

    initPassport()
    app.use(passport.initialize())
    app.use(passport.session())

    //app.use(express.static('public'))
    app.use(express.static('src/images'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    //app.use(logger('dev'))
        
    ////////////////////// Rutas //////////////////////////////    
    app.use('/api/productos', routerfProductos)
    app.use('/api/auth', authRouter)
    app.use('/', infoRouter)
    
    //--------------------------------------------------------------------------
    app.use('/procesos', procesosRouter)
    // (req, res) => {
    //     const PORT = config.options.PORT
    //     const MODE = config.options.MODE
    //     const date = new Date().toLocaleString()
    //     res.send(`  Servidor express NGINX en puerto: ${PORT} <br><br>
    //                 PID: ${process.pid}<br><br>
    //                 Numero de CPUs: ${app.numCPUs}<br><br>
    //                 MODO: ${MODE}<br><br>
    //                 Fecha y Hora: ${date}`)
    // })
    
    ////////////////////////////////////////////////////////
    app.get("/getUsers", (req, res) => {
        res.json({ users })
      })
    
    app.get("/newUser", (req, res) => {
        let username = req.query.username || "";
        const password = req.query.password || "";
    
        username = username.replace(/[!@#$%^&*]/g, "");
    
        if (!username || !password || users[username]) {
            return res.sendStatus(400);
        }
    
        const salt = crypto.randomBytes(128).toString("base64");
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
    
        users[username] = { salt, hash };
    
        res.sendStatus(200);
    })
    
    app.get("/auth-bloq", (req, res) => {
        let username = req.query.username || "";
        const password = req.query.password || "";
      
        username = username.replace(/[!@#$%^&*]/g, "");
      
        if (!username || !password || !users[username]) {
          process.exit(1)
          // return res.sendStatus(400);
        }
      
        const { salt, hash } = users[username];
        const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512");
      
        if (crypto.timingSafeEqual(hash, encryptHash)) {
          res.sendStatus(200);
        } else {
          process.exit(1)
          // res.sendStatus(401);
        }
    })
    

    app.get("/auth-nobloq", (req, res) => {
        let username = req.query.username || "";
        const password = req.query.password || "";
        username = username.replace(/[!@#$%^&*]/g, "");
      
        if (!username || !password || !users[username]) {
          process.exit(1)
          //return res.sendStatus(400);
        }
        crypto.pbkdf2(password, users[username].salt, 10000, 512, 'sha512', (err, hash) => {
          if (users[username].hash.toString() === hash.toString()) {
            res.sendStatus(200);
          } else {
            process.exit(1)
            //res.sendStatus(401);
          }
        });
    });

  //   app.use('*', (req, res)=>{
  //     const { url, method} = req
  //     logger.error('No existe la ruta')
  //     res.send(`No existe la ruta especificada: ${url} - con el método : ${method}`)
  // })
  

    ///////////////////////////////////////////////////////
//_____________________________________________ socket.io _____________________________________ //   
    initSocket(io)
//______________________________________________________________________________________________//

    return {
        listen: port => new Promise((res, rej)=>{
            const server = httpServer.listen(port, () => {
                res(server)
            })
            server.on('error', err => rej(err))
        })
    }
}

module.exports = initServer