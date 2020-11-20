import React, { useReducer, createContext, useContext } from 'react'


const MessageSatateContext = createContext()
const MessageDispatchContext = createContext()

// setear el token al estado del usuario
// PAYLOAD es el objecto completo del usuario, los datos del usuario!


const messageReducer = (state, action) => {
    switch(action.type){
        case 'SET_USERS':
            return{
                ...state,
                users: action.payload
            };

        case 'SET_USER_MESSAGES':
            const { username, message } = action.payload
            return 

        case 'SET_SELECTED_USER':
            const userCopy = state.users.map(user => ({
                ...user,
                selected: user.username === action.payload
            }))
                console.log('context', userCopy)
            return {
                ...state,
                user: userCopy
            }

        default:
            throw new Error(`Error inesperado ${action.type}`)
    }
}

export const MessageProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(messageReducer, { users: null })

    return(
    <MessageDispatchContext.Provider value={dispatch}>
        <MessageSatateContext.Provider value={state}>
            { children }
        </MessageSatateContext.Provider>
    </MessageDispatchContext.Provider>
    )

}

export const useMessageState = () => useContext(MessageSatateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)


// El contexto forma dos partes, y la logica de estas es manejada por el useReducer, el contexto tiene la parte de dispaatch, que es la que manda datos a la variable state, 
// esta variables state es aprovechada por el reducer para mandarle datos de entrada a la variable inciazada, en este caso a users