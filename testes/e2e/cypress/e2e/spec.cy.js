describe('Primeiro teste end-to-end', () => {
  it('Cadastra uma pergunta e verifica se ela é listada', () => {
    cy.visit('http://localhost:3000');

    cy.get('#textarea-pergunta')
      .should('exist')
      .type('3+3', { force: true });

    cy.get('#btn-pergunta').click();

    cy.get('#tabela-perguntas')
      .should('contain', '3+3');
  });
});
