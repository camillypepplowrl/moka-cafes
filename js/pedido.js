// sacola, entrega e historico de pedidos
const listaSacola = document.getElementById("lista-sacola");
const modeloItem = document.getElementById("modelo-item-sacola");
const listaPedidos = document.getElementById("lista-pedidos");
const modeloPedido = document.getElementById("modelo-pedido");
const formPedido = document.getElementById("form-pedido");
const avisoPedido = document.getElementById("aviso-pedido");
const campoBairro = document.getElementById("bairro");
const campoEndereco = document.getElementById("endereco");

function mostrarMensagem(elemento, tipo, texto) {
    if (tipo === "sucesso") {
        elemento.className = "alert alert-success";
    } else {
        elemento.className = "alert alert-danger";
    }
    elemento.textContent = texto;
}

function calcularResumo() {
    const sacola = lerSacola();
    let subtotal = 0;
    for (let i = 0; i < sacola.length; i++) {
        subtotal = subtotal + sacola[i].preco * sacola[i].qtd;
    }
    subtotal = arredondar(subtotal);

    let entrega = 0;
    if (sacola.length > 0) {
        entrega = Number(campoBairro.selectedOptions[0].dataset.taxa);
    }

    const total = arredondar(subtotal + entrega);
    return { subtotal: subtotal, entrega: entrega, total: total };
}

function desenharResumo() {
    const resumo = calcularResumo();
    document.getElementById("r-subtotal").textContent = formatarPreco(resumo.subtotal);
    document.getElementById("r-entrega").textContent = formatarPreco(resumo.entrega);
    document.getElementById("r-total").textContent = formatarPreco(resumo.total);
}

function desenharSacola() {
    const sacola = lerSacola();
    listaSacola.innerHTML = "";
    let totalItens = 0;

    for (let i = 0; i < sacola.length; i++) {
        const item = sacola[i];
        const linha = modeloItem.content.cloneNode(true);
        let detalhe = formatarPreco(item.preco) + " cada";
        if (item.tam !== "") {
            detalhe = item.tam + " - " + detalhe;
        }

        linha.querySelector(".foto").src = item.imagem;
        linha.querySelector(".foto").alt = item.nome;
        linha.querySelector(".nome").textContent = item.nome;
        linha.querySelector(".detalhe").textContent = detalhe;
        linha.querySelector(".qtd").textContent = item.qtd;
        linha.querySelector(".subtotal").textContent = formatarPreco(item.preco * item.qtd);
        linha.querySelector(".menos").dataset.indice = i;
        linha.querySelector(".mais").dataset.indice = i;
        listaSacola.appendChild(linha);
        totalItens = totalItens + item.qtd;
    }

    document.getElementById("sacola-vazia").hidden = sacola.length > 0;
    document.getElementById("resumo").hidden = sacola.length === 0;
    document.getElementById("esvaziar").hidden = sacola.length === 0;
    document.getElementById("contador-sacola").textContent = totalItens;
    desenharResumo();
}

function desenharPedidos() {
    const pedidos = lerLista(CHAVE_PEDIDOS);
    listaPedidos.innerHTML = "";
    document.getElementById("sem-pedidos").hidden = pedidos.length > 0;

    for (let i = pedidos.length - 1; i >= 0; i--) {
        const pedido = pedidos[i];
        const linha = modeloPedido.content.cloneNode(true);
        let itens = "";
        for (let j = 0; j < pedido.itens.length; j++) {
            itens = itens + pedido.itens[j].qtd + "x " + pedido.itens[j].nome + "; ";
        }

        linha.querySelector(".numero").textContent = "Pedido #" + pedido.numero;
        linha.querySelector(".data").textContent = pedido.data;
        linha.querySelector(".itens").textContent = itens;
        linha.querySelector(".entrega").textContent = pedido.entrega + " - " + pedido.pagamento;
        linha.querySelector(".total").textContent = formatarPreco(pedido.total);
        listaPedidos.appendChild(linha);
    }
}

function ajustarEntrega() {
    if (campoBairro.value === "Retirada na loja") {
        campoEndereco.required = false;
        campoEndereco.disabled = true;
        campoEndereco.value = "";
    } else {
        campoEndereco.required = true;
        campoEndereco.disabled = false;
    }
    desenharResumo();
}

listaSacola.addEventListener("click", function (evento) {
    const botao = evento.target;
    const sacola = lerSacola();
    const indice = Number(botao.dataset.indice);

    if (sacola[indice] === undefined) {
        desenharSacola();
        return;
    }
    if (botao.classList.contains("mais")) {
        sacola[indice].qtd = sacola[indice].qtd + 1;
    }
    if (botao.classList.contains("menos")) {
        sacola[indice].qtd = sacola[indice].qtd - 1;
        if (sacola[indice].qtd === 0) {
            sacola.splice(indice, 1);
        }
    }
    gravarLista(CHAVE_SACOLA, sacola);
    desenharSacola();
});

document.getElementById("esvaziar").addEventListener("click", function () {
    gravarLista(CHAVE_SACOLA, []);
    desenharSacola();
});

campoBairro.addEventListener("change", ajustarEntrega);

formPedido.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const sacola = lerSacola();

    if (sacola.length === 0) {
        mostrarMensagem(avisoPedido, "erro", "Adicione pelo menos um item à sacola.");
        return;
    }

    if (formPedido.checkValidity() === false) {
        mostrarMensagem(avisoPedido, "erro", "Corrija os campos destacados antes de finalizar.");
        formPedido.reportValidity();
        return;
    }

    const resumo = calcularResumo();
    const retirada = campoBairro.value === "Retirada na loja";
    let entrega = "Retirada na loja";
    if (retirada === false) {
        entrega = campoBairro.value + " - " + campoEndereco.value;
    }

    const pedidos = lerLista(CHAVE_PEDIDOS);
    const numero = pedidos.length + 1;
    pedidos.push({
        numero: numero,
        data: new Date().toLocaleString("pt-BR"),
        cliente: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        observacoes: document.getElementById("observacoes").value,
        entrega: entrega,
        pagamento: document.getElementById("pagamento").value,
        total: resumo.total,
        itens: sacola
    });
    gravarLista(CHAVE_PEDIDOS, pedidos);

    gravarLista(CHAVE_SACOLA, []);

    formPedido.reset();
    ajustarEntrega();

    let prazo = "Entrega prevista em 30 a 45 minutos.";
    if (retirada === true) {
        prazo = "Retire na loja em cerca de 15 minutos.";
    }
    mostrarMensagem(avisoPedido, "sucesso", "Pedido #" + numero + " confirmado! " + prazo);
    desenharSacola();
    desenharPedidos();
});

ajustarEntrega();
desenharSacola();
desenharPedidos();
