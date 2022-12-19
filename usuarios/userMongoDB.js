const mongoose = require('mongoose');
const Usuarios = require('../models/usuarios.models')
const logger = require('../utils/winston.js')

class ServerMongoDB {
    constructor() {
        this.connect()
    }
    
    connect() {
        try {
            const URL = process.env.MONGO_URL_CONNECT_ECOM
            mongoose.connect(URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            logger.info('Connected to MongoDB Server')
            //console.log('Connected to MongoDB Server')
            
        } catch (error) {
            logger.error('Error connecting to MongoDB Server' + error)
            //console.error('Error connection to DB: '+error)
        }
    }

    async createUser(usuario){
        try {
            const newUser = new Usuarios(usuario)
            await newUser.save()
            logger.info('User created: ' + newUser)
            //console.log('User created: ' + newUser)
        } catch (error) {
            logger.error(error)
            //console.log(error)
        }
    }

    async getUser(){
        try {
            const users = await Usuarios.find()
            logger.info(users)
            //console.log(users)
        } catch (error) {
            logger.error(error)
            //console.log(error)
        }
    }

    async getUserByUsername(username){
        try {
            const user = await Usuarios.findOne( {username: `${username}`} )
            console.log('usuario: ', user)
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async getUserByUsernameAndPass(username, password) { 
        console.log('username--pass-- ', username)
        try {
            const user = await Usuarios.findOne( {username: `${username}`, password: `${password}` } )
            // console.log('user-::>> ', user)
            if ( user === [] || user === undefined || user === null) {
                return false    
            } else {
                return true
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = { ServerMongoDB }