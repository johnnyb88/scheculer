describe("Navigation", () => {
  beforeEach(() => {
    cy.request("GET", "http://localhost:8001/api/debug/reset");

    cy.visit("/");

    cy.contains("Monday");

  });


  xit("should navigate to Tuesday", () => {
    
    cy.contains("[data-testid=day]", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected");
  });

  it("should book an interview", () => {
   
    // cy.contains("Monday")

    cy.get("[alt='Add']")
      .first()
      .click();

    cy.get("[data-testid='student-name-input']")
      .type("Lydia Miller-Jones")

    cy.get("li")
      .children("[alt='Sylvia Palmer']")
      .click()

    cy.contains("Save")
      .click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.contains(".appointment__card--show", "Archie Cohen")
      .get("[alt='Edit']")
      .click({ force: true })
      .get("[data-testid='student-name-input']")
      .clear()
      .type("John")
    cy.get("li")
      .children("[alt='Tori Malcolm']")
      .click()

    cy.contains("Save")
      .click()

    cy.contains(".appointment__card--show", "John");
    cy.contains(".appointment__card--show", "Tori Malcolm");
    // cy.get("[alt='Tori Malcolm']")
  });

  it("should cancel an interview", () => {
    cy.contains(".appointment__card--show", "Archie Cohen")
      .get("[alt='Delete']")
      .click({ force: true })
    cy.contains("Confirm")
      .click()
      cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});