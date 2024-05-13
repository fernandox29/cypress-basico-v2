/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {

  beforeEach(function () {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', function () {
    cy.title().should('be.eq', 'Central de Atendimento ao Cliente TAT')
  })
  it('preenche os campos', function () {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando@gmail.com', { delay: 0 })
    cy.get('#phone').type('999999999');
    cy.get('select').select('YouTube')
      .should('have.value', 'youtube')
    cy.get('[type="radio"]').check('elogio')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })
  it('email invalido', function () {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando.gmail.com', { delay: 0 })
    cy.get('#phone').type('999999999');
    cy.get('select').select(1)
      .should('have.value', 'blog')
    cy.get('#product').select('YouTube')
      .should('have.value', 'youtube')
    cy.get('[type="radio"]')
      .check('feedback')
      .should('have.value', 'feedback')
    cy.get('[type="radio"][value="elogio"]')
      .check()
      .should('be.checked')
    cy.get('#open-text-area').type('Teste, estou testando essa aplicação!')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })
  it('verificar campo telefone', function () {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando@gmail.com', { delay: 0 })
    cy.get('#phone').type('abcdef');
    cy.get('#phone').should('have.text', '')
    cy.get('select').select('Cursos')
    cy.get('[type="radio"]').check('elogio')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('preenchemento obrigatorio telefone', function () {
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando@gmail.com', { delay: 0 })
    cy.get('select').select('cursos')
    cy.get('[type="radio"]').check('elogio')
    cy.get('[type="checkbox"]')
      .check('phone')
      .should('be.checked')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName').type('Fernando').should('have.value', 'Fernando')
    cy.get('#firstName').clear().should('have.value', '')
    cy.get('#lastName').type('Silva').should('have.value', 'Silva')
    cy.get('#lastName').clear().should('have.value', '')
    cy.get('#email').type('fernando@gmail.com', { delay: 0 }).should('have.value', 'fernando@gmail.com')
    cy.get('#email').clear().should('have.value', '')
    cy.get('#phone')
      .type('999999999')
      .should('have.value', '999999999')
      .clear()
      .should('have.value', '')
  })
  it('submeter o formulario sem preencher os campos', function () {
    cy.contains('button', 'Enviar').click()
    cy.get('.error').should('be.visible')
  })
  it('envia o formuário com sucesso usando um comando customizado', function () {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
  })

  it('marca todos os radio button', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', function () {

    //marca todos os checkbox e desmarca o último.
    cy.get('[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')

  })

  it('seleciona um arquivo da pasta fixtures', function () {

    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json')
      .then(input => {
        expect(input[0].files[0].name).to.eq('example.json')
      })

  })

  it('seleciona arquivo - metodo 2', function () {
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq('example.json')
      })
  })
  it('seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq('example.json')
      })
  })
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    // const arquivo = 'cypress/fixtures/example.json'
    cy.fixture('example.json').as('sampleFile')
    cy.get('input[type="file"]')
      .should('not.have.value')
      .selectFile('@sampleFile')
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq('example.json')
      })
  })
  it('verifica que o link abre em outra aba', function(){
    cy.get('#privacy > a').should('have.attr', 'target', '_blank')
  })

  it('abre o link que abriria em outra aba na mesma aba', function(){
    cy.get('#privacy > a')
    .invoke('removeAttr', 'target')
    .click()
    cy.contains('Talking About Testing').should('be.visible')
    cy.get('#white-background > p:nth-child(1)')
    .should('have.text', 'Não salvamos dados submetidos no formulário da aplicação CAC TAT.')
  })

// Funçao que verifica se o link abre em uma nova aba
  function opensInNewTab(link) {
    return link.attr('target') === '_blank';
  }
  
  it('verifica que o link abre em outra aba', function() {
    cy.get('#privacy > a').then(($link) => {
      if (opensInNewTab($link)) {
        // Remove o atributo "target" do link
        cy.wrap($link).invoke('removeAttr', 'target');
      }
      // Clica no link
      cy.wrap($link).click();
    });
  });
  
  

})