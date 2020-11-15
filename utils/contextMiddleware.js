const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')

module.exports = ( context ) => {

    if(context.req && context.req.headers.autorization ){
        const token = context.req.headers.autorization.split('Bearer ')[1]
        jwt.verify(token, JWT_SECRET, (err, decodeToken) => {
            context.user = decodeToken
        })
    }
    return context 
}

