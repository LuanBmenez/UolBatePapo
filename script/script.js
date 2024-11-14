let username = prompt("Seu lindo nome: ");
const ID = "3184ce15-e740-4b0a-ad9c-bc3a8b767424";


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

function entrarNaSala(username) {
    const novoUsuario = { name: username };

    axios.post(urlParticipantes, novoUsuario)
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


function verificarStatusConexao() {
    const data = { name: username };

    axios.post(urlStatus, data)
        .then(response => {
            console.log('Status online enviado com sucesso!', response);
        })
        .catch(error => {
            console.log('Erro ao enviar status online', 'desconectando usuário...', error);
            alert("Conexão perdida. Por favor, entre novamente.");
            window.location.reload();
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
            if (tipo === "private_message") {
                renderizarMensagem(novaMensagem.from, novaMensagem.to, novaMensagem.text, novaMensagem.type, formatarHora());
            } else {
                renderizarMensagem(novaMensagem.from, novaMensagem.to, novaMensagem.text, novaMensagem.type, formatarHora());//os dois estão fazendo a mesma coisa
            }
        })
        .catch(error => {
            console.log("Erro ao enviar mensagem:", error);
        });

    input.value = "";
}


function renderizarMensagem(from, to, text, type, time) {
    const ul = document.querySelector(".mensagem");
    const li = document.createElement("li");
    

    if (type === "status") {
        li.style.backgroundColor = "rgba(220, 220, 220, 1)";
        li.innerHTML = `<strong>${from}</strong>  &nbsp;${text}`;
    } else if (type === "private_message") {
        if ((from === username && to === destinatario) || (from === destinatario && to === username)) {
            li.style.backgroundColor = "rgba(255, 222, 222, 1)";
            li.innerHTML = `(${time}) <strong>${from}</strong>&nbsp;reservadamente para &nbsp;<strong>${to}</strong>: ${text}`;
        } else {
            return; 
        }
    } else {
        li.style.backgroundColor = "rgba(255, 255, 255, 1)";
        li.innerHTML = `(${time}) <strong>${from}</strong>&nbsp;para&nbsp;<strong>${to}</strong> : ${text}`;
    }

    ul.appendChild(li);
    li.scrollIntoView();
}


document.querySelector(".enviar").addEventListener("click", enviarMensagem);


function buscarMensagensAnteriores() {

    const ul = document.querySelector(".mensagem");
    ul.innerHTML = "";  

    axios.get(urlMensagens)
        .then(response => {
            console.log("Mensagens carregadas com sucesso!", response);
            const mensagens = response.data;

   
            mensagens.forEach(mensagem => {
                renderizarMensagem(mensagem.from, mensagem.to, mensagem.text, mensagem.type, mensagem.time);
            });
        })
        .catch(error => {
            console.log("Erro ao carregar mensagens:", error);
        });
}




function buscarParticipantes() {


    axios.get(urlParticipantes)
        .then(response => {
            console.log("Lista de usuários adquirida com sucesso!", response);
            const participantes = response.data;

            listaUsuarios.innerHTML = `<li class="usuario-item" id="opcaoTodos" onclick="marcarUsuario(this)">
                 <ion-icon class="people" name="people"></ion-icon>
            Todos
                <ion-icon name="checkmark-sharp" class="check escondido"></ion-icon>
            </li>`;

            participantes.forEach(participante => {
                const li = document.createElement("li");
                li.classList.add("usuario-item");
                li.innerHTML = `
                    <ion-icon name="person-circle-sharp"></ion-icon>
                    ${participante.name}
                    <ion-icon name="checkmark-sharp" class="check escondido"></ion-icon>
                `;
                li.addEventListener('click', function() {
                    marcarUsuario(this);
                });
                listaUsuarios.appendChild(li);
            });
        })
        .catch(error => {
            console.log("Erro ao adquirir lista de participantes:", error);
        });
}

function marcarOpcao(idElementoClicado) {
    const elementosOpcoes = document.querySelectorAll('.span-publico, .span-priv');
    const enviandoParaSpan = document.getElementById('enviandoPara'); 
    
    elementosOpcoes.forEach(elemento => {
        const checkIcon = elemento.querySelector('.check');
        if (elemento.id === idElementoClicado) {
            checkIcon.classList.remove('escondido');
            tipo = idElementoClicado === "opcaoPrivado" ? "private_message" : "message";
            
            // Atualiza o texto do span
            if (idElementoClicado === "opcaoPrivado") {
                enviandoParaSpan.textContent = `Enviando para ${destinatario} (reservadamente)`;
            } else {
                enviandoParaSpan.textContent = `Enviando para ${destinatario} (publicamente)`;
            }
        } else {
            checkIcon.classList.add('escondido');
        }
    });
}

function marcarUsuario(elementoClicado) {
    const usuarios = document.querySelectorAll('.usuario-item');
    const enviandoParaSpan = document.getElementById('enviandoPara');
    
    usuarios.forEach(usuario => {
        const checkIcon = usuario.querySelector('.check');
        if (usuario === elementoClicado) {
            checkIcon.classList.remove('escondido');
            destinatario = usuario.textContent.trim();
            
            
            if (tipo === "private_message") {
                enviandoParaSpan.textContent = `Enviando para ${destinatario} (reservadamente)`;
            } else {
                enviandoParaSpan.textContent = `Enviando para ${destinatario} (publicamente)`;
            }
        } else {
            checkIcon.classList.add('escondido');
        }
    });
}

const listaUsuarios = document.querySelector('.listaUsuarios');


function adicionarUsuario(nomeUsuario) {
    const li = document.createElement('li');
    li.classList.add('usuario-item');
    li.innerHTML = `
    <ion-icon name="person-circle-sharp"></ion-icon>
    ${nomeUsuario}
    <ion-icon name="checkmark-sharp" class="check escondido"></ion-icon>
    `;
    li.addEventListener('click', function() {
        marcarUsuario(this);
    });
    listaUsuarios.appendChild(li);
}





buscarParticipantes()
setInterval(buscarParticipantes, 10000);

setInterval(buscarMensagensAnteriores, 3000);
buscarMensagensAnteriores(); 