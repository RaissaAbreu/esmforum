describe('Quarto teste end-to-end', () => {

  it('Exclui uma pergunta e verifica se ela foi removida', () => {

    cy.visit('http://localhost:3000');

    cy.get('#tabela-perguntas')
      .should('be.visible');

    cy.on('window:confirm', () => true);

    // Pega o ID da primeira pergunta
    cy.get('#tabela-perguntas tbody tr')
      .first()
      .find('td')
      .eq(0)
      .invoke('text')
      .then((idPergunta) => {

        // Exclui exatamente essa pergunta
        cy.get('#tabela-perguntas tbody tr')
          .first()
          .find('button')
          .contains('Excluir')
          .click();

        // Verifica que o ID excluído não existe mais
        cy.get('#tabela-perguntas tbody tr')
          .should('not.contain', idPergunta.trim());
      });

  });

});
