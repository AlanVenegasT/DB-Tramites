const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');



class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath     = '/api/auth';

        //Conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection()
    }


    //Middleware: son funciones que le van añadir otra funcionalidad a un webserver
    //Una funcion que siempre se va a ejecutar siempre que levantemos el servidor
    //Se crea un metodo de Middleware
    //use es la palabra clave de un middleware
    middlewares(){

        //CORD
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Se hace la llamada al directorio publico
        this.app.use( express.static('public'));

    }

    //Este es un metodo por lo no tengo haceeso y tengo que usuar la misma sintaxis de mi contructor
    routes(){
        //Vamos a usar un middleware para otorgarle ciertas rutas
        //Conte middleware se llama ak archivo donde tenemos las rutas
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }
 
    //Ahora vamos a crear un metodo para mis rutas
    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor correindo en puerto', this.port);
        });
    }

}

module.exports = Server;