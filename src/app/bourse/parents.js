class ParentsController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const parents = {
  template: require('./parents.html'),
  controller: ParentsController
};

