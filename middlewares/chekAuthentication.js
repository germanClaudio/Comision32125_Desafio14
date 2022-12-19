const { request } = require('express')

const checkAtuhentication = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/api/auth/login");
}

module.exports = { checkAtuhentication }