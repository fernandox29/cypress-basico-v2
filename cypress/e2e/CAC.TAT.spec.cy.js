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
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should('be.visible')
    cy.tick(3000) //avançar o tempo em 3 segundos
    cy.get('.success').should('not.be.visible')

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
  it('verifica que o link abre em outra aba', function () {
    cy.get('#privacy > a').should('have.attr', 'target', '_blank')
  })

  it('abre o link que abriria em outra aba na mesma aba', function () {
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

  it('verifica que o link abre em outra aba', function () {
    cy.get('#privacy > a').then(($link) => {
      if (opensInNewTab($link)) {
        // Remove o atributo "target" do link
        cy.wrap($link).invoke('removeAttr', 'target');
      }
      // Clica no link
      cy.wrap($link).click();
    });
  });


  //executa o mesmo teste 5 vezes
  Cypress._.times(5, () => {
    it('testando a funcao cypress time', function () {
      cy.get('#firstName').type('Fernando')
      cy.get('#lastName').type('Silva')
      cy.get('#email').type('fernando@gmail.com', { delay: 0 })
      cy.get('select').select('cursos')
      cy.get('[type="radio"]').check('elogio')
      cy.get('#open-text-area').type('Teste')
      cy.contains('button', 'Enviar').click()
      cy.get('.success').should('be.visible')
    })
  })

  it('testar o comando ctrl c ctrl v', function () {
    const texto = Cypress._.repeat('teste teste ', 20)
    cy.get('#firstName').type('Fernando')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('fernando@gmail.com', { delay: 0 })
    cy.get('select').select('cursos')
    cy.get('[type="radio"]').check('elogio')
    cy.get('#open-text-area')
      .invoke('val', texto)
      .should('have.value', texto)
    cy.contains('button', 'Enviar').click()
    cy.get('.success').should('be.visible')
  })

  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it.only('faz aparecer o gatinho', function () {
    cy.get('#cat')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
    cy.get('#subtitle')
      .invoke('text', 'Eu alterei o sub título')
  });

})

describe('Teste de API', function () {

  it('teste de api metodo 1', () => {

    cy.request({
      method: 'GET',
      url: 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.body).to.include('CAC TAT');
    })
  })

  it('teste de api metodo 2', function () {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
      .should(function (response) {
        // console.log(response) -> Verificar o log no inspecionar do browser
        const { status, statusText, body } = response
        expect(status).to.eq(200)
        expect(statusText).to.eq('OK')
        expect(body).to.include('CAC TAT')
      })
  })

})