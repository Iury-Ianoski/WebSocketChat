var socket = io();

const form = document.getElementById("form");
const text = document.getElementById("text");
const messages = document.getElementById("messages");
const usernameInput = document.getElementById("username");
const joinBtn = document.getElementById("joinBtn");
const sendBtn = form.querySelector("button");


let username = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!username) {
      alert("Conecte-se primeiro para poder enviar mensagens!");
      return;
    }
    if (username && text.value.trim()) {
    socket.emit("message", text.value);
    text.value = "";
    }
});

socket.on("message", addMessage);

socket.on("messageHistory", (history) => {
    history.forEach(addMessage);
});

function addMessage(msg) {
    const li = document.createElement("li");
    li.textContent = `${msg.user}: ${msg.text}`;

    if (msg.user === username) {
        li.classList.add("eu");
    } else if (msg.user === 'Sistema') {
        li.classList.add("sistema")
    } else{
        li.classList.add("outro");
    }

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
}

joinBtn.onclick = () => {
username = usernameInput.value.trim();
    if (username) {
      socket.emit("setUsername", username);
      joinBtn.disabled = true;
      usernameInput.disabled = true;

      text.disabled = false;
      sendBtn.disabled = false;
      text.focus();
    } else {
      alert("informe um nome antes de entrar no chat.");
    }
};

