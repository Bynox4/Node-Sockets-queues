import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketController } from '../sockets/controller.js';

class Servidor {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = new Server( this.server );

        this.paths = {
        }

        // Conectar a base de datos

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Directorio public
        this.app.use( express.static('public') );
    }

    routes(){
        // this.app.use( this.paths.auth, auth );
    }

    sockets(){
        this.io.on('connection', socketController );
    }

    listen(){
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en el servidor', this.port );
        });
    }

}


export default Servidor;