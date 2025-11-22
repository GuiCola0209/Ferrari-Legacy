const cardContainer = document.querySelector(".card-container");
const buscaInput = document.querySelector("#busca-input");
const filterContainer = document.querySelector("#filter-container");
let dados = [];
let filtroAtivo = 'Todos';

// Carrega os dados do JSON assim que a página é carregada
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        criarFiltros();
        aplicarFiltrosEBusca();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function criarFiltros() {
    const categorias = new Set();
    dados.forEach(dado => {
        const categoria = dado.tags[0].split(' - ')[0];
        categorias.add(categoria);
    });

    const categoriasOrdenadas = ['Todos', ...Array.from(categorias).sort()];

    categoriasOrdenadas.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.textContent = categoria;
        if (categoria === 'Todos') {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            filtroAtivo = categoria;
            aplicarFiltrosEBusca();
        });
        filterContainer.appendChild(btn);
    });
}

function aplicarFiltrosEBusca() {
    const termoBusca = buscaInput.value.toLowerCase();
    
    let resultados = dados;

    // 1. Aplicar filtro de categoria
    if (filtroAtivo !== 'Todos') {
        resultados = resultados.filter(dado => dado.tags[0].startsWith(filtroAtivo));
    }

    // 2. Aplicar filtro de busca
    if (termoBusca) {
        resultados = resultados.filter(dado => dado.nome.toLowerCase().includes(termoBusca));
    }

    renderizarCards(resultados);
}

function renderizarCards(cardsParaRenderizar) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    for (let dado of cardsParaRenderizar) {
        const tagsHtml = dado.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <div class="tags-container">
            ${tagsHtml}
        </div>
        <p><strong>Ano:</strong> ${dado.ano}</p>
        <p>${dado.descricao}</p>

        <a href="${dado.link}" target="_blank">Saiba mais</a>`

        cardContainer.appendChild(article);
    }
}

// Chama a função para carregar os dados quando o script é executado
carregarDados();

// Adiciona um evento para escutar a tecla "Enter" no campo de busca
buscaInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        aplicarFiltrosEBusca();
    }
});

function iniciarBusca() {
    aplicarFiltrosEBusca();
}