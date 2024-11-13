let username = prompt("qual o seu nome?: ");

const ID = "40cd3981-63ed-4b15-bd52-c6e475cd4743"

const urlParticipantes = `https://mock-api.driven.com.br/api/v6/uol/participants/${ID}`;
const urlStatus = `https://mock-api.driven.com.br/api/v6/uol/status/${ID}`;
const urlMensagens = `https://mock-api.driven.com.br/api/v6/uol/messages/${ID}`;

let destinatario = "Todos"; 
let tipo = "message";

const abrirmenu = document.getElementById("people");
const fechar = document.getElementById("fechar");
const menu = document.getElementById("menuLateral");

abrirmenu.addEventListener("click", toggleMenu);
fechar.addEventListener("click", toggleMenu);

function toggleMenu() {
    const Open = menu.classList.contains("aberto");


    menu.classList.toggle("aberto", !Open);
    menu.classList.toggle("fechado", Open);
}

toggleMenu()

function entrarNaSala(username){
    const url = `https://mock-api.driven.com.br/api/v6/uol/participants/${ID}`;
    const novoUsuario = { name: username };

    axios.post(url, novoUsuario)
        .then(response => {
            console.log('Entrou na sala com sucesso!', response);
        })
        .catch(error => {
            if (error.response && error.response.status === 400) {
                console.log('Nome já em uso, escolha outro nome.');
                pedirNovoNome();
            } else {
                console.error('Erro ao tentar entrar na sala:', error);
            }
        });
}

function pedirNovoNome() {
    const novoNome = prompt("Nome já em uso. Por favor, escolha outro nome:");
    if (novoNome) {
        username = novoNome;
        entrarNaSala(novoNome);
    }
}

entrarNaSala(username);

let tentativasReconexao = 0;
const maxTentativas = 3;

function verificarStatusConexao() {
    const data = { name: username };

    axios.post(urlStatus, data)
        .then(response => {
            console.log('Status online enviado com sucesso!', response);
            tentativasReconexao = 0; // Reseta as tentativas após sucesso
        })
        .catch(error => {
            console.log('Erro ao enviar status online', error);

            if (tentativasReconexao < maxTentativas) {
                tentativasReconexao++;
                console.log(`Tentativa de reconexão ${tentativasReconexao}/${maxTentativas}`);
            } else {
                alert("Conexão perdida. Por favor, entre novamente.");
                window.location.reload();
            }
        });
}

setInterval(verificarStatusConexao, 5000);

function formatarHora() {
    const agora = new Date();
    const horas = agora.getHours().toString().padStart(2, "0");
    const minutos = agora.getMinutes().toString().padStart(2, "0");
    const segundos = agora.getSeconds().toString().padStart(2, "0");
    return `${horas}:${minutos}:${segundos}`;
}

function enviarMensagem() {
    const input = document.querySelector(".enviarMensagem");
    const msg = input.value;

    const novaMensagem = {
        from: username,
        to: destinatario,
        text: msg,
        type: tipo
    };

    axios.post(urlMensagens, novaMensagem)
    .then(response => {
        console.log("Mensagem enviada com sucesso!", response);
        renderizarMensagem(novaMensagem.from, novaMensagem.to, novaMensagem.text, novaMensagem.type, formatarHora());
    })
    .catch(error => {
        console.log("Erro ao enviar mensagem:", error);
    });
    input.value = "";
}

function renderizarMensagem(from, to, text, type, time) {
    const ul = document.querySelector(".mensagem");
    const li = document.createElement("li");
    let backgroundColor;
    let mensagemTexto;

    if (type === "status") {
        backgroundColor = "rgba(220, 220, 220, 1)";
        mensagemTexto = `${from} ${text}`;
    } else if (type === "private_message") {
        if ((from === username && to === destinatario) || (from === destinatario && to === username)) {
            backgroundColor = "rgba(255, 222, 222, 1)";
            mensagemTexto = `(${time}) ${from} reservadamente para ${to}: ${text}`;
        } else {
            return; // Ignora a mensagem se não for para o usuário ou destinatário específico
        }
    } else {
        backgroundColor = "rgba(255, 255, 255, 1)";
        mensagemTexto = `(${time}) ${from} para ${to}: ${text}`;
    }

    li.style.backgroundColor = backgroundColor;
    li.textContent = mensagemTexto;

    ul.appendChild(li);
    li.scrollIntoView();
}

document.querySelector(".enviar").addEventListener("click", enviarMensagem);