class ParentsController {
  /** @ngInject */
  constructor(simulation, $stateParams) {
    this.sim = simulation;
    this.index = $stateParams.index;
  }
}

export const parents = {
  template: require('./parents.html'),
  bindings: {
    personne: '<'
  },
  controller: ParentsController
};

