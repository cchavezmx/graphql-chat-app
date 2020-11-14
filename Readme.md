## Sequelize

Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more

[Manual](https://sequelize.org/master/index.html)

Guia de comandos: 

Para crear los modelos que trabajaran con sequelize y mysql 

Generamos los modelos desde la consola: 

````shell

sequelize model:generate --name User --attributes username:string, email:string

````

Una vez establecidos los campos que traducira Graphql de la base de datos de Mysql necestiamos mandarl los cambios en la tabla mysql 

Esta reescribe los campos en la base de datos mysql 

sequelize db:migrate:undo:all

y reescribimos las columnas: 

sequelize db:migrate 

### Ojo db:migrate:undo:all borra toda la tabla, no se debe usar en produccion sin un respaldo


## Variables de entorno se setean dentro de config
env.json

````json

{
    "JWT_SECRET": "mi clave de entorno"
}

````