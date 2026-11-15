// abre e fecha o menu no celular
const botaoMenu = document.getElementById("botao-menu");
const menu = document.getElementById("menu-principal");

botaoMenu.addEventListener("click", function () {
    menu.classList.toggle("aberto");
});
