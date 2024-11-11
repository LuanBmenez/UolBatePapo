const menu = document.getElementById("menuLateral");
const overlay = document.getElementById("overlay");
const abrirmenu = document.getElementById("people");

function toggleMenu() {
    // Verifica se o menu já está aberto
    const Open = menu.classList.contains("aberto");


    menu.classList.toggle("aberto", !Open);
    menu.classList.toggle("fechado", Open);
    overlay.classList.toggle("visivel", !Open);
    overlay.classList.toggle("escondido", Open);
}

abrirmenu.addEventListener("click", toggleMenu);

overlay.addEventListener("click", toggleMenu);
