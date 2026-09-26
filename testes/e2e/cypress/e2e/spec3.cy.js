describe('Terceiro teste end-to-end', () => {

  it('Edita uma pergunta e verifica se ela foi alterada', () => {

    cy.visit('http://localhost:3000');

    cy.get('#tabela-perguntas')
      .should('be.visible');

    cy.window().then((win) => {
      cy.stub(win, 'prompt')
        .returns('Pergunta editada pelo Cypress');
    });

    cy.get('#tabela-perguntas tbody tr')
      .first()
      .find('button')
      .contains('Editar')
      .click();

    cy.get('#tabela-perguntas')
      .should('contain', 'Pergunta editada pelo Cypress');

  });

});
