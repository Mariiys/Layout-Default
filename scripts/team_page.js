const secoes = document.querySelectorAll('.secao');
const anterior = document.getElementById('anterior');
const proximo = document.getElementById('proximo');

let indiceAtual = 0;

function mostrarSecao(index) {
  secoes.forEach((secao, i) => {
    secao.classList.toggle('visivel', i === index);
  });
}

anterior.addEventListener('click', () => {
  indiceAtual = (indiceAtual - 1 + secoes.length) % secoes.length;
  mostrarSecao(indiceAtual);
});

proximo.addEventListener('click', () => {
  indiceAtual = (indiceAtual + 1) % secoes.length;
  mostrarSecao(indiceAtual);
});

// Mostrar a primeira seção ao carregar
mostrarSecao(indiceAtual);
