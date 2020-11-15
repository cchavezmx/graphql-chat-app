const { UserInputError, AuthenticationError } = require('apollo-server');
const { Message, User } = require('../../models')
// los modelos se sacan desdel el index 

const { Op } = require('sequelize')


module.exports = {
    Query: {
        getMessages: async (_, { from }, { user }) => {

            try {
                            // verificamos si el usuario esta autheticado
            if(!user) throw new AuthenticationError('Unauthenticated')

            // otro usuario
            const otherUser = await User.findOne({
                where: { username: from }
            })

            if(!otherUser) throw new UserInputError('El usuario no existe')

            const usernames = [user.username, otherUser.username]

            const message = await Message.findAll({
                where: {
                    from: { [Op.in]: usernames },
                    to: { [Op.in]: usernames },
                },
                order: [['createdAt', 'DESC']]
            })

            return message
                
            } catch (error) {
                console.log(error)
            }
        }
    },
    Mutation: {

        SendMessage: async ( parent, args, { user }) => {           
            const { to, content } = args

            // Controlamos que no se puedan reeviar mensaje a uno mismo
            if( User.username === to){
                throw new UserInputError('No te puedes mandar mensajes')
            }

            try {
                if(!user) throw new AuthenticationError('Unauthednticated')

                // Revisamos si el buzon del usuario esta disponible
                const recipient = await User.findOne({ where: { username: to }})

                console.log(recipient.username)
                
                // Verificamos 1. que el buzon de usuario exista 2.- que no sea el buzon de la persona que envia 
                if(!recipient){
                    throw new UserInputError('User not found ')
                } else if(recipient.username === user.username){
                    throw new UserInputError('Auto mensaje no permitido')
                }


                // revisamos que el mensaje no este vacio
                if(content.trim() === ''){
                    throw new UserInputError('El mensaje no puede estar vacio')
                }

                // Creamos el el mensaje 
                const message = await Message.create({
                    from: user.username,
                    to,
                    content
                })

                return message

            } catch (error) {
                console.log(error)
            }
        },
    }
};


// los mutacion de typeDef pasan como props y son tomados por la variable args, para poder ser usados en los metodos 
// Pensemos que TypeDef define las rutas y resovler son los metodos que se realizan en estas 
// Mutation permiten enviar informacion a la base de datos, atravez de sequalize


// TODO https://www.youtube.com/watch?v=NTU-vLYNTJQ