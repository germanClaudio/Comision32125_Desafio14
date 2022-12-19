const countVisits = (req, res, next) => {
    console.log('req count visits:    ',req)
    req.session.visits = req.session.visits ? req.session.visits + 1 : 1
    next()
}
module.exports = {
    countVisits
}
