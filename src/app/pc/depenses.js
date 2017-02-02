class DepensesController {
  constructor() {
    this.text = 'PC depenses';
  }
}

export const depenses = {
  template: require('./depenses.html'),
  controller: DepensesController
};

