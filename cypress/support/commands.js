Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando@gmail.com')
    cy.get('#phone').type('999999999');
    cy.get('select').select('cursos')
    cy.get('[type="radio"]').check('elogio')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})