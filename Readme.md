## Manuales


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

<strong>sequelize db:migrate:undo:all</strong>

y reescribimos las columnas: 

sequelize db:migrate 

<h3>Ojo</h3> <strong>db:migrate:undo:all</strong> borra toda la tabla, no se debe usar en produccion sin un respaldo


## Variables de entorno

env.json dentro de la carpeta config

````json

{
    "JWT_SECRET": "mi clave de entorno"
}

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


## Notas: 

<ul>
<li>El contexto de este proyecto proovee un metodo que toma el valor del token para saber que usuario esta logeado en la aplicacion</li>
<li></li>
<li></li>
</ul>


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
