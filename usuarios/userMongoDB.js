const mongoose = require('mongoose');
const Usuarios = require('../models/usuarios.models')


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
            console.log('Connected to MongoDB Server')
            
        } catch (error) {
            console.error('Error connection to DB: '+error)
        }
    }

    async createUser(usuario){
        try {
            const newUser = new Usuarios(usuario)
            await newUser.save()
            console.log('User created: ' + newUser)
        } catch (error) {
            console.log(error)
        }
    }

    async getUser(){
        try {
            const users = await Usuarios.find()
            console.log(users)
        } catch (error) {
            console.log(error)
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