## Readme


<ul>
<li><a><h3>Sequelize</h3><li>
<li><a href="https://github.com/apollographql/apollo-server">Apollo-Server<li>
<li><a href="https://www.apollographql.com/docs/apollo-server/getting-started/">Apollo-Server DOCS<li>
</ul>

## Sequelize
[Manual](https://sequelize.org/master/index.html)

Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more

Guia de comandos: 

Para crear los modelos que trabajaran con sequelize y mysql 

Generamos los modelos desde la consola: 

````shell

sequelize model:generate --name User --attributes username:string, email:string

````

Una vez establecidos los campos que traducira Graphql de la base de datos de Mysql necestiamos mandarl los cambios en la tabla mysql 

Esta reescribe los campos en la base de datos mysql 

````shell

sequelize db:migrate:undo:all

````

y reescribimos las columnas: 

````shell

sequelize db:migrate 

````
<h3>Ojo</h3> <strong>db:migrate:undo:all</strong> borra toda la tabla, no se debe usar en produccion sin un respaldo


## Variables de entorno

env.json dentro de la carpeta config

````json

{
    "JWT_SECRET": "mi clave de entorno"
}

````

<strong> 1 . - </strong>Para crear base de datos fake

````bash

sequelize seed:generate --name create-users

````

Con este paso se crea una modelo parecido a el de migraciones y pero este sellamara seedes, con este modelo podemos hacer practicas 

<strong> 2 . - </strong>Una vez creados las bases creamos los cambios con el siguiente comando: 

````bash

❯ sequelize db:seed:all

````


## Version de Sass
[Documentación](https://github.com/sass/node-sass)

Para trabajar con la version de Node 14 hay que instalar la version 4.14 de sass

```` bash

install node-sass@4.14.1

````

## Agregamos Apollo Client

[Documentación](https://www.apollographql.com/docs/react/get-started/)

```` javascript

import { ApolloClient, InMemoryCache } from '@apollo/client';

// Caambiamos la uri por la de nuestro proyecto

import { ApolloClient, InMemoryCache, ApolloProvider as Provider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:400',
  cache: new InMemoryCache()
});


export default function ApolloProvider(props){
    return <Provider client={client} { ...props } />
}

````

una vez que realizamos el archivo de proveedor, tenemos que envolver toda nuesta app para poder tomar entre componente las variables de Apollo-Server
las mutation, querys, resolver... etc


```` javascript

import { ApolloProvider } from './ApolloProvider'

return (
    <ApolloProvider>
        <MiComponente />
    </ApolloProvider>
)

```` 

## Uso de Use UseReducer y UseContext´

Creamos un context para poder compartir metodos y funciones y el useReducer para poder hacer el cambio del login y logout del usuario

````javascript
import React, { useReducer, createContext, useContext } from 'react'


const AuthSatateContext = createContext()
const AuthDispatchContext = createContext()


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

export const AuthProvieder = ({ children }) => {
    const [ state, dispatch ] = useReducer(authReducer, { user: null })

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

````

## Protegiendo Rutas

Para proterger rutas craemos un componente que redirija hacia el componente con props

```` javascript

import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuthState } from '../context/authContext'

export default function DynamicRouters(props){
    const { user } = useAuthState()

    if(props.auth && !user){
        return <Redirect to="/login" />
    } else if(props.guest && user){
        return <Redirect to="/" />
    } else {
        return <Route component={props.component} { ...props} />
    }
}


export default App;

````

## GraphQL Playground

```` bash 
mutation register{
  register(username: "Carlos" email:"carlos@correo.com" password: "123456" confirmPassword: "123456"){
    username
  }
}

query getUser {
  getUser{
    username email
  }
}

query login{
  login(username: "Carlos" password:"123456"){
    username token createdAt
  }
}

mutation Message{
  SendMessage(to: "Dalia" content: "Enviado desde Carlos a Dalia"){
    content from uuid createdAt
  }
}

query getMessages {
  getMessages(from: "Dalia"){
    from to content uuid createdAt
  } 
}

# Recuerda agregar la cabezera HTTP
{
  "Autorization": "Bearer JWT"
}


```` 
## Notas: 

<ul>
<li>El contexto de este proyecto proovee un metodo que toma el valor del token para saber que usuario esta logeado en la aplicacion</li>
<li>El servidor desencripta y encripta el token para poder verificar si el usuario esta conectado, este proceso se lleva acabo en el middleware, el contextMiddleware, revisar si existe la cabezera authorization y setea en este el token, asi, junto este token envia el usuario atravez de destructoracion al query de login
</li>
<li>recuerda siempre debuggear sequelize db:seed:all --debug</li>
<li>window.location.href = '/login' para poder redireccionar a login </li>
</ul>
