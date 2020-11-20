const bcrypt = require('bcryptjs')
const { UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config/env.json')
const { Op } = require('sequelize')

const { User } = require('../../models')
const { Message } = require('../../models')
// los modelos se sacan desdel el index 
module.exports = {
Query: {
        getUser: async (_, __, { user }) => {
        // TODO verificar usuarios conectados
        // Este resolver regresa en un arreglo a las personas que no estan logeadas. 
                    
            try { 
                console.log(user)
            if(!user) throw new UserInputError('Unauthenticated')

        // seleccionamos la informacion del documento que queremos extraer
            let users = await User.findAll({
                attributes: [ 'username', 'imageUrl', 'createdAt'],
                where: { username: { [Op.ne]: user.username }}
            });

            const allUsersMessages =  await Message.findAll({
                where: {
                    [Op.or] : [{ from: user.username }, { to: user.username }]
                },
                order: [['createdAt', 'DESC']]
                
            })
            console.log('aca los mensajes del query ', allUsersMessages)
 
            users = users.map(person => {
                const latestMessage = allUsersMessages.find(
                    m => m.from === person.username || m.to === person.username
                )
                person.latestMessage = latestMessage
                return person
            })


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

                // ya que revisamos que el todo este bien toca encriptar y generar un token para la sesion
                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 60 * 60 });

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt,
                    token
                }

            } catch (error) {
                throw new UserInputError('Input Error', { errors })
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

            // email exist
            const userByusername = await User.findOne({ where: { username }})
            const userByuemail = await User.findOne({ where: { email }})
            
            if(userByuemail) errors.email = 'La cuenta de correo ya existe'
            if(userByusername) errors.username = 'El usario ya existe'

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
                throw new UserInputError('Bad input', { errors })
            }

        },
        
    }
};


// los mutacion de typeDef pasan como props y son tomados por la variable args, para poder ser usados en los metodos 
// Pensemos que TypeDef define las rutas y resovler son los metodos que se realizan en estas 
// Mutation permiten enviar informacion a la base de datos, atravez de sequalize
