var socket = io();

const message = document.getElementById('messages')
const text = document.getElementById('text')
const form = document.getElementById('form');

form.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(text.value.trim()){
        socket.emit('message', text.value)
        text.value = "";
    }
})

socket.on('message', (msg) =>{
    const li = document.createElement('li');
    li.textContent = msg
    message.appendChild(li)
});