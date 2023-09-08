const User = require('../models/User')
const jwt = require('jsonwebtoken')
const secret = process.env.JWTSECRET

const authGuard = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    // Check if header has a token
    if (!token) return res.status(401).json({errors: ['Acesso Negado!']})

    // Check if token is valid
    try {
        const verified = jwt.verify(token, secret)

        req.user = await User.findById(verified.id).select('-password')
        next()
    } catch (error) {
        res.status(401).json({errors: ['Token Inválido!']})
    }
}

module.exports = authGuard