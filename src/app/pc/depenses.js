class DepensesController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const depenses = {
  template: require('./depenses.html'),
  controller: DepensesController
};

