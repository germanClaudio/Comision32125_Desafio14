const { Router } = require('express')

const routerCookies = Router()

routerCookies.get('/', (req, res) => {
    const { 
        signedCookies
        // cookies 
    } =  req
    // console.log(req.cookies)
    res.status(200).json({signedCookies})
})


routerCookies.get('/set', (req, res) => {
    const { cookies } =  req
    res.cookie('nombre','German',{
        signed: true
    })
    // console.log(req.cookies)
    res.status(200).json({
        message: 'Cookie seteada',
        succes: true
    })
})

routerCookies.get('/setEx', (req, res) => {
    const { cookies } =  req
    res.cookie('apellido','Montalbetti', { 
        // signed: true,
        maxAge: 30000 
    })
    // console.log(req.cookies)
    res.status(200).json({
        message: 'Cookie seteada',
        succes: true
    })
})

routerCookies.get('/borrar', (req, res) => {
    const { cookies } =  req
    res.clearCookie('nombre')
    // console.log(req.cookies)
    res.status(200).json({
        message: 'Cookie borrada',
        succes: true
    })
})

module.exports = routerCookies