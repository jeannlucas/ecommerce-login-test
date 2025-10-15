/// <reference types="cypress" />

describe("Test Suite - Login DemoBlaze", () => {
  beforeEach(() => {
    cy.visit("https://www.demoblaze.com/index.html", {
      onBeforeLoad: (win) => {
        delete win.navigator.__proto__.serviceWorker;
      },
    });

    cy.url().should("eq", "https://www.demoblaze.com/index.html");

    cy.document().should("have.property", "readyState", "complete");
  });

  it("Deve fazer login com sucesso", () => {
    cy.get("#login2").should("be.visible").click();

    cy.get("#logInModal")
      .should("be.visible")
      .within(() => {
        cy.get("#loginusername").clear().type("bigz");
        cy.get("#loginpassword").clear().type("14031994");
        cy.contains("button", "Log in").click();
      });

    cy.contains("Welcome bigz", { timeout: 10000 }).should("be.visible");
    cy.contains("Log out").should("be.visible");

    cy.screenshot("login-sucesso");
  });

  it("Não deve logar com credenciais inválidas", () => {
    cy.get("#login2").click();

    cy.get("#logInModal")
      .should("be.visible")
      .within(() => {
        cy.get("#loginusername").clear().type("bigz");
        cy.get("#loginpassword").clear().type("1403");
        cy.contains("button", "Log in").click();
      });

    cy.on("window:alert", (txt) => {
      expect(txt).to.contain("User does not exist.");
    });
  });

  it("Deve exibir alerta ao tentar login com campos vazios", () => {
    cy.get("#login2").should("be.visible").click();

    cy.get("#logInModal")
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Log in").click();
      });

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.contain("Please fill out Username and Password.");
    });
  });
});
