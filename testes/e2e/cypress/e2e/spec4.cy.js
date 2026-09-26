describe('Quarto teste end-to-end', () => {

  it('Exclui uma pergunta e verifica se ela foi removida', () => {

    cy.visit('http://localhost:3000');

    cy.get('#tabela-perguntas')
      .should('be.visible');

    // Confirma a exclusão no window.confirm()
    cy.on('window:confirm', () => true);

    // Guarda o texto da primeira pergunta
    cy.get('#tabela-perguntas tbody tr')
      .first()
      .find('td')
      .eq(1)
      .invoke('text')
      .then((textoPergunta) => {

        // Clica em Excluir na primeira linha
        cy.get('#tabela-perguntas tbody tr')
          .first()
          .find('button')
          .contains('Excluir')
          .click();

        // Verifica que o texto da pergunta excluída
        // não aparece mais na tabela
        cy.get('#tabela-perguntas')
          .should('not.contain', textoPergunta.trim());
      });

  });

});
