const jwt = require('jsonwebtoken')
const clave_jwt = process.env.JWT_PRIVATE_KEY

function generateToken(username) {
    const token = jwt.sign(
        { 
            data: username 
        }, 
        clave_jwt, 
        { 
            expiresIn: '12h' 
        }
    );
    return token;
}

module.exports = { generateToken }