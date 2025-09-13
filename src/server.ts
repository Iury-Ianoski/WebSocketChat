import { Socket } from 'dgram'
import express from 'express'
import http  from 'http'
import path from 'path'
import { Server } from "socket.io"
import { fileURLToPath } from 'url'

class App{
    private app: express.Application
    private http: http.Server
    private io: Server

    constructor(){
        this.app = express()
        this.http = http.createServer(this.app)
        this.io = new Server(this.http)
        
        this.listenSocket()
        this.configEjs()
        this.routes()
    }
    listenServer(){
        this.http.listen(3000, ()=> console.log('Tá rodando'))
    }
    listenSocket(){
        this.io.on('connection', (Socket) =>{
            console.log('Usuário conectado: ', Socket.id)
            
            Socket.on('message', (msg) =>{
                this.io.emit('message', msg)
            });
        })
    }
    configEjs(){
        this.app.set('view engine', 'ejs');
        this.app.set('views', './src/views');
        this.app.use(express.static(path.dirname(fileURLToPath(import.meta.url)) + "/public"));
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.render('index')
        })
    }
}

const app = new App()

app.listenServer()
