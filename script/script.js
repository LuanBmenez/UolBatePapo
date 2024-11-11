let username = prompt("qual o seu nome?: ");

const ID = "40cd3981-63ed-4b15-bd52-c6e475cd4743"

const urlParticipantes = `https://mock-api.driven.com.br/api/v6/uol/participants/${ID}`;
const urlStatus = `https://mock-api.driven.com.br/api/v6/uol/status/${ID}`;
const urlMensagens = `https://mock-api.driven.com.br/api/v6/uol/messages/${ID}`;



function toggleMenu() {
    
    const menu = document.getElementById("menuLateral");
    const abrirmenu = document.getElementById("people");
    const fechar = document.getElementById("fechar")


    const Open = menu.classList.contains("aberto");


    menu.classList.toggle("aberto", !Open);
    menu.classList.toggle("fechado", Open);
    
    abrirmenu.addEventListener("click", toggleMenu);
    fechar.addEventListener("click",toggleMenu )
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