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

    private users: Record<string, string> = {}
    private messageHistory: { user: string, text: string }[] = []
    private MAX_HISTORY = 20

    constructor(){
        this.app = express()
        this.http = http.createServer(this.app)
        this.io = new Server(this.http)
        
        this.listenSocket()
        this.configEjs()
        this.routes()
    }
    listenServer(){
        this.http.listen(3000, ()=> console.log('Está rodando em http://localhost:3000'))
    }
    listenSocket() {
        this.io.on('connection', (socket: Socket) => {
            console.log('Usuário conectado:', socket.id)

            //usuário entra com nome
            socket.on('setUsername', (username: string) => {
                this.users[socket.id] = username
                console.log(`${username} entrou no chat.`)

                socket.emit('messageHistory', this.messageHistory)

                this.io.emit('message', {
                    user: "Sistema",
                    text: `${username} entrou no chat`
                });
            })

            //Envio de mensagens
            socket.on('message', (msg: string) => {
                const message = {
                    user: this.users[socket.id],
                    text: msg
                }

                this.messageHistory.push(message)
                if (this.messageHistory.length > this.MAX_HISTORY) {
                    this.messageHistory.shift()
                }

                this.io.emit('message', message)
            })

            //Usuário desconecta
            socket.on('disconnect', () => {
                const username = this.users[socket.id]
                delete this.users[socket.id]

                if (username) {
                    this.io.emit('message', {
                        user: "Sistema",
                        text: `${username} saiu do chat`
                    })
                }
            })
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
