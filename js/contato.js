// formulario de contato
const formContato = document.getElementById("form-contato");
const aviso = document.getElementById("aviso");
const campoMensagem = document.getElementById("mensagem");
const caracteresRestantes = document.getElementById("restante");
const listaMensagens = document.getElementById("lista-mensagens");
const modeloMensagem = document.getElementById("modelo-mensagem");

function desenharMensagens() {
    const mensagens = lerLista(CHAVE_MENSAGENS);
    listaMensagens.innerHTML = "";
    document.getElementById("sem-mensagens").hidden = mensagens.length > 0;

    for (let i = mensagens.length - 1; i >= 0; i--) {
        const linha = modeloMensagem.content.cloneNode(true);
        linha.querySelector(".nome").textContent = mensagens[i].nome;
        linha.querySelector(".assunto").textContent = mensagens[i].assunto;
        linha.querySelector(".data").textContent = mensagens[i].data;
        linha.querySelector(".texto").textContent = mensagens[i].mensagem;
        listaMensagens.appendChild(linha);
    }
}

function tirarEspacosDosCampos() {
    const campos = formContato.querySelectorAll("input[type=text], input[type=email], textarea");
    for (let i = 0; i < campos.length; i++) {
        campos[i].value = campos[i].value.trim();
    }
}

formContato.addEventListener("submit", function (evento) {
    evento.preventDefault();
    tirarEspacosDosCampos();

    if (formContato.checkValidity() === false) {
        aviso.className = "aviso erro";
        aviso.textContent = "Corrija os campos destacados antes de enviar.";
        formContato.reportValidity();
        return;
    }

    const mensagens = lerLista(CHAVE_MENSAGENS);
    mensagens.push({
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        assunto: document.getElementById("assunto").value,
        mensagem: campoMensagem.value,
        data: new Date().toLocaleString("pt-BR")
    });
    gravarLista(CHAVE_MENSAGENS, mensagens);

    formContato.reset();
    caracteresRestantes.textContent = 300;
    aviso.className = "aviso sucesso";
    aviso.textContent = "Mensagem enviada. Obrigado pelo contato!";
    desenharMensagens();
});

campoMensagem.addEventListener("input", function () {
    caracteresRestantes.textContent = 300 - campoMensagem.value.length;
});

document.getElementById("limpar-mensagens").addEventListener("click", function () {
    localStorage.removeItem(CHAVE_MENSAGENS);
    desenharMensagens();
});

desenharMensagens();
