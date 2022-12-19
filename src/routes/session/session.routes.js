const { Router } = require('express')
const { sessionGet, sessionLogout, sessionPostLogin } = require('../../routes/session/session.controllers')
const { authMiddleware } = require('../../middleware/auth.middleware')

const routerSession = Router()

routerSession.get('/', authMiddleware, sessionGet)
routerSession.get('/logout', sessionLogout)
routerSession.get('/login', sessionGet )
routerSession.post('/login', sessionPostLogin )

module.exports = routerSession