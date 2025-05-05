async function getCep() {
    let cep = document.querySelector('#cep').value;

    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    
    const response = await fetch(apiUrl);
    const objJson = await response.json();
    console.log(objJson);
    return objJson;
}

async function mostrarCep() {
    document.querySelector('.loader').style.display = "inline-block";
    document.querySelector('#btnConsulta').style.display = "none";  
    const objCep = await getCep();
    
    const mostrarInfo = {
        cep: objCep.cep,
        logradouro: objCep.logradouro,
        bairro: objCep.bairro,
        localidade: objCep.localidade,
        uf: objCep.uf,
        ddd: objCep.ddd
    };
    console.log(mostrarInfo.cep);

    // Verifica se o CEP já existe
    let dadosCep = JSON.parse(localStorage.getItem("dadosCep") || "[]");
    if (dadosCep.some(item => item.cep === mostrarInfo.cep)) {
        mostrarModal();
        return;
    } else {
        adicionarLinhaTabela(mostrarInfo);
    }

    document.querySelector('.loader').style.display = "none"; 
    document.querySelector('#btnConsulta').style.display = "inline-block"; 
}

function atualizarTabela(mostrarInfo){
    return `
        <td>${mostrarInfo.cep}</td>
        <td>${mostrarInfo.logradouro}</td>
        <td>${mostrarInfo.bairro}</td>
        <td>${mostrarInfo.localidade}</td>
        <td>${mostrarInfo.uf}</td>
        <td>${mostrarInfo.ddd}</td>
        <td class="text-center"><button class="btn btn-danger btn-sm" onclick="removerCep('${mostrarInfo.cep}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg></button></td>
    `;
}

function adicionarLinhaTabela(mostrarInfo) {
    const tbody = document.querySelector("#dadosCep");

    // Remove linha inicial se existir
    if (tbody.children.length === 1 && tbody.children[0].cells.length === 1) {
        tbody.innerHTML = "";
    }

    const novaLinha = document.createElement("tr");
    novaLinha.innerHTML = atualizarTabela(mostrarInfo);

    let dadosCep = JSON.parse(localStorage.getItem("dadosCep") || "[]");
    dadosCep.push(mostrarInfo);
    localStorage.setItem("dadosCep", JSON.stringify(dadosCep));

    tbody.insertBefore(novaLinha, tbody.firstChild);
}

function carregarTabela() {
    const tbody = document.querySelector("#dadosCep");
    let dadosCep = JSON.parse(localStorage.getItem("dadosCep") || "[]");

    if (dadosCep.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Nenhum CEP pesquisado ainda.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = "";
    dadosCep.forEach(mostrarInfo => {
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = atualizarTabela(mostrarInfo);
        tbody.appendChild(novaLinha);
    });
}

function removerCep(cep) {
    let dadosCep = JSON.parse(localStorage.getItem("dadosCep") || "[]");
    dadosCep = dadosCep.filter(item => item.cep !== cep);
    localStorage.setItem("dadosCep", JSON.stringify(dadosCep));
    carregarTabela();
}

function mostrarModal() {
    const fadeElement = document.querySelector("#fade");
    const messageElement = document.querySelector("#message");
    const mensagemErro = document.querySelector("#message p");
  
    mensagemErro.innerText = 'CEP já registrado ou inválido!';
  
    fadeElement.classList.toggle("hide");
    messageElement.classList.toggle("hide");

    const closeButton = document.querySelector("#close-message");
    closeButton.addEventListener("click", () => {
        mostrarModal();
        document.querySelector(".loader").style.display = "none";
        document.querySelector("#btnConsulta").style.display = "inline-block";
    });
};

function removerTudo(){
    localStorage.setItem("dadosCep", "");
    carregarTabela();
}

window.onload = () => {
    carregarTabela();
};