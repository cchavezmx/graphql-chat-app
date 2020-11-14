const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.json')
const { Op } = require('sequelize')

const { User } = require('../models')
// los modelos se sacan desdel el index 

module.exports = {
Query: {
        getUser: async (_, __, context) => {
        // TODO verificar usuarios conectados
        // Este resolver regresa en un arreglo a las personas que no estan logeadas. 
                    
            try { 
            // let userLogged
            // if(context.req && context.req.headers.autorization)
            let user
            if(context.req && context.req.headers.autorization ){
                const token = context.req.headers.autorization.split('Bearer ')[1]
                jwt.verify(token, JWT_SECRET, (err, decodeToken) => {
                    if(err){
                        throw new AuthenticationError('Error en la sesion', err)
                    }
                    user = decodeToken
                })
            }

            const users = await User.findAll({
                where: { username: { [Op.ne]: user.username }}
            });
            return users
            
            } catch (err) {
            throw err
            }
        },
        login: async (_, args) => {
                const { username, password } = args
                const errors = {}

            try {
            
            // controlar que si el usuario no  ingresa un nombre de usuario este no diga que no existe
            // aunque esto se puede controlar desde las validaciones de usuario el el formulario 
                if(username.trim() === '')  errors.username = 'debe ingresar un nombre de usuario'
                if(password === '')  errors.password = 'El campo de contraseña no puede estar vacia'

                // antes de continiar revisamos que no tengamos errores
                if (Object.keys(errors).length > 0){
                    throw new UserInputError('Input Error', { errors })
                }

                // buscamos el nombre del usuario
                const user = await User.findOne({
                    where: { username }
                })
                if(!user){
                    errors.username = 'El usuario no existe'
                    throw new UserInputError('Input Error', { errors })
                }

                const correctPaswod = await bcrypt.compare(password, user.password)

                if(!correctPaswod){
                    errors.password = 'Error en la contraseña'
                    throw new UserInputError('Input Error', { errors })
                }

                // ya que revisamos que el todo este bien nos toca encriptar y generar un token para la sesion
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 60 * 60 });

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token
                }

            } catch (error) {
                throw new UserInputError('Input Error', { error:  { errors }  })
            }
        },
        
    },
    Mutation: {
        register: async ( _, args, context, info ) => {

            let { username, email, password, confirmPassword }  = args
            let errors = {}

            try {

            // Validate entradas
            if(email.trim() === '') errors.email = 'El email no debe estar vacio'
            if(username.trim() === '') errors.username = 'El username no debe estar vacio'
            if(password.trim() === '') errors.password = 'El password no debe estar vacio'
            if(confirmPassword.trim() === '') errors.confirmPassword = 'La confirmacion esta vacia'
            
            // Validar que los dos campos de password sean iguales
            if(password !== confirmPassword ) errors.confirmPassword = 'Los passwords no conciden'

            // Revisar sin el usuario existe // email exist
            // const userByusername = await User.findOne({ where: { username }})
            // const userByuemail = await User.findOne({ where: { email }})
            
            // if(userByuemail) errors.email = 'La cuenta de correo ya existe'
            // if(userByusername) errors.username = 'El usario ya existe'

            if(Object.keys(errors).length > 0) throw errors

            // has password
            password = await bcrypt.hash(password, 6)

            // Creaar Usario
            const user = await User.create({
                username, email, password
                })

            // retornar el usuario
                return user

            } catch (err) {
                if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach(e => errors[e.path] = e.message)
                }else if (err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(e => (errors[e.path] = `El ${e} ya existe`))
                }
                throw new UserInputError('Bad input', { err })
            }

        }
    }
};


// los mutacion de typeDef pasan como props y son tomados por la variable args, para poder ser usados en los metodos 
// Pensemos que TypeDef define las rutas y resovler son los metodos que se realizan en estas 