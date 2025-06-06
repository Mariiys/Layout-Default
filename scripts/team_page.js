 let indiceAtual = 0;
    const membros = document.querySelectorAll('.membro');
    const miniaturas = document.querySelectorAll('.miniatura');

    function atualizarVisibilidade() {
      membros.forEach((secao, index) => {
        secao.classList.toggle('ativo', index === indiceAtual);
      });

      miniaturas.forEach((thumb, index) => {
        thumb.classList.toggle('ativa', index === indiceAtual);
      });
    }

    function avancar() {
      indiceAtual = (indiceAtual + 1) % membros.length;
      atualizarVisibilidade();
    }

    function voltar() {
      indiceAtual = (indiceAtual - 1 + membros.length) % membros.length;
      atualizarVisibilidade();
    }

    function irPara(indice) {
      indiceAtual = indice;
      atualizarVisibilidade();
    }