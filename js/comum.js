// funcoes que todas as paginas usam (localStorage, preco e contador da sacola)
const CHAVE_SACOLA = "moka.sacola";
const CHAVE_PEDIDOS = "moka.pedidos";
const CHAVE_MENSAGENS = "moka.mensagens";

function lerLista(chave) {
    const texto = localStorage.getItem(chave);
    if (texto === null) {
        return [];
    }
    return JSON.parse(texto);
}

function lerSacola() {
    return lerLista(CHAVE_SACOLA);
}

function gravarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
}

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function arredondar(valor) {
    return Math.round(valor * 100) / 100;
}

function mostrarAviso(texto) {
    const aviso = document.getElementById("aviso-flutuante");
    aviso.textContent = texto;
    aviso.hidden = false;
    setTimeout(function () {
        aviso.hidden = true;
    }, 2000);
}

function atualizarContador() {
    const sacola = lerSacola();
    let total = 0;
    for (let i = 0; i < sacola.length; i++) {
        total = total + sacola[i].qtd;
    }
    document.getElementById("contador-sacola").textContent = total;
}

atualizarContador();
document.querySelector(".ano-atual").textContent = new Date().getFullYear();
