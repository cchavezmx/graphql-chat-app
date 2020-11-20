import React, { useReducer, createContext, useContext } from 'react'
import decode from 'jwt-decode'

const AuthSatateContext = createContext()
const AuthDispatchContext = createContext()

// setear el token al estado del usuario


let user
const token = localStorage.getItem('Token')

if(token){
    const decodedToken = decode(token)
    
    const expiresAt = new Date(decodedToken * 1000)

    if(new Date() > expiresAt){
        localStorage.removeItem('Token')
    }else{
        
        user = decodedToken
    }
} else console.log('no token found xD')



const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('Token', action.payload.token)
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('Token')
            return{
                ...state,
                user: null
            }
        default:
            throw new Error(`Error inesperado ${action.type}`)
    }
}

export const AuthProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, { user })

    return(
    <AuthDispatchContext.Provider value={dispatch}>
        <AuthSatateContext.Provider value={state}>
            { children }
        </AuthSatateContext.Provider>
    </AuthDispatchContext.Provider>
    )

}

export const useAuthState = () => useContext(AuthSatateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)

