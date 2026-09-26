describe('Segundo teste end-to-end', () => {

  it('Cadastra uma resposta e verifica se ela é listada', () => {

    // Abre a página principal
    cy.visit('http://localhost:3000');

    // Aguarda a tabela de perguntas carregar
    cy.get('#tabela-perguntas')
      .should('be.visible');

    // Clica no link de respostas da primeira pergunta
    cy.get('#tabela-perguntas tbody tr')
      .first()
      .find('td')
      .eq(2)
      .find('a')
      .click();

    // Aguarda a página de respostas carregar
    cy.get('#textarea-resposta')
      .should('be.visible');

    // Digita a resposta
    cy.get('#textarea-resposta')
      .type('Resposta cadastrada pelo Cypress', { force: true });

    // Envia a resposta
    cy.get('#btn-resposta')
      .click();

    // Verifica se a resposta apareceu
    cy.get('#tabela-respostas')
      .should('contain', 'Resposta cadastrada pelo Cypress');

  });

});
