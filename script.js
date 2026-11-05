let colecaoMidia = [];

async function carregarCatalogo() {
    const container_card = document.getElementById('catalogo-grid');
    container_card.innerHTML = "<p>Carregando itens, aguarde...</p>";

    try {
        const resposta = await fetch('dados.json');
        if (!resposta.ok) throw new Error('Erro ao buscar dados');

        colecaoMidia = await resposta.json();
        renderizarGrid(colecaoMidia);
    } catch (erro) {
        container_card.innerHTML = `<p style="color:#ef4444;">Erro ao carregar catálogo: ${erro.message}</p>`;
    }
}

function renderizarGrid(lista) {
    const container = document.getElementById('catalogo-grid');
    container.innerHTML = "";

    if (!lista || lista.length === 0) {
        container.innerHTML = `<p class="info">Nenhum item cadastrado nesta categoria.</p>`;
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';

        const notaFormatada = Number(item.nota).toFixed(1);

        card.innerHTML = `
            ${item.capa ? `<img src="${item.capa}" alt="${item.titulo}" class="capa-midia">` : ''}
            <div>
                <span class="tag-categoria">${item.categoria}</span>
                <h3>${item.titulo}</h3>
                <p class="info">Plataforma: ${item.plataforma}</p>
                <p class="info">Nota: <span class="nota">${notaFormatada}</span></p>
                <p class="info">Status: <strong>${item.status || 'Pendente'}</strong></p>
            </div>
        `;
        container.appendChild(card);
    });
}

document.getElementById('form-midia').addEventListener('submit', function (e) {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const categoria = document.getElementById('categoria').value;
    const plataforma = document.getElementById('plataforma').value;
    const nota = parseFloat(document.getElementById('nota').value);

    if (categoria === 'Categoria') {
        alert('Por favor, selecione uma categoria válida.');
        return;
    }

    const novoItem = {
        id: Date.now(),
        titulo: titulo,
        categoria: categoria,
        plataforma: plataforma,
        nota: nota,
        status: 'Adicionado recentemente',
        capa: ''
    };

    colecaoMidia.unshift(novoItem);
    renderizarGrid(colecaoMidia);
    this.reset();
});

document.querySelectorAll('.filtros button').forEach(botao => {
    botao.addEventListener('click', (e) => {
        const categoriaFiltro = e.target.textContent.trim();

        if (categoriaFiltro === 'Todos') {
            renderizarGrid(colecaoMidia);
        } else {
            const filtrados = colecaoMidia.filter(item => 
                item.categoria.toLowerCase().startsWith(categoriaFiltro.toLowerCase().slice(0, -1)) ||
                item.categoria.toLowerCase() === categoriaFiltro.toLowerCase()
            );
            renderizarGrid(filtrados);
        }
    });
});

document.addEventListener('DOMContentLoaded', carregarCatalogo);