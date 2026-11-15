// filtro, busca e botao de adicionar ao pedido
const listaProdutos = document.getElementById("lista-produtos");
const campoBusca = document.getElementById("busca-produto");
const avisoVazio = document.getElementById("sem-resultado");
const botoesCategoria = document.querySelectorAll("#abas button");
let categoriaAtual = "todas";

function filtrar() {
    const textoBuscado = campoBusca.value.trim().toLowerCase();
    const produtos = listaProdutos.children;
    let visiveis = 0;

    for (let i = 0; i < produtos.length; i++) {
        const nome = produtos[i].dataset.nome.toLowerCase();
        const nomeCombina = nome.includes(textoBuscado);
        const categoriaCombina = categoriaAtual === "todas" || produtos[i].dataset.categoria === categoriaAtual;

        if (nomeCombina && categoriaCombina) {
            produtos[i].hidden = false;
            visiveis = visiveis + 1;
        } else {
            produtos[i].hidden = true;
        }
    }
    avisoVazio.hidden = visiveis > 0;
}

function adicionarNaSacola(produto) {
    const sacola = lerSacola();
    let achou = false;

    for (let i = 0; i < sacola.length; i++) {
        if (sacola[i].id === produto.id && sacola[i].tam === produto.tam) {
            sacola[i].qtd = sacola[i].qtd + 1;
            achou = true;
        }
    }
    if (achou === false) {
        produto.qtd = 1;
        sacola.push(produto);
    }
    gravarLista(CHAVE_SACOLA, sacola);
    atualizarContador();
}

for (let i = 0; i < botoesCategoria.length; i++) {
    botoesCategoria[i].addEventListener("click", function () {
        for (let j = 0; j < botoesCategoria.length; j++) {
            botoesCategoria[j].classList.remove("ativa");
        }
        botoesCategoria[i].classList.add("ativa");
        categoriaAtual = botoesCategoria[i].dataset.cat;
        filtrar();
    });
}

campoBusca.addEventListener("input", filtrar);

listaProdutos.addEventListener("click", function (evento) {
    const botao = evento.target;
    if (botao.classList.contains("btn-add") === false) {
        return;
    }

    const cartao = botao.closest("li");
    const seletor = cartao.querySelector("select");
    let tamanho = "";
    let preco = Number(cartao.dataset.preco);

    if (seletor !== null) {
        tamanho = seletor.value;
        preco = preco + Number(seletor.selectedOptions[0].dataset.adicional);
    }

    adicionarNaSacola({
        id: Number(cartao.dataset.id),
        nome: cartao.dataset.nome,
        imagem: cartao.dataset.imagem,
        tam: tamanho,
        preco: preco
    });
    mostrarAviso(cartao.dataset.nome + " adicionado ao pedido");
});
