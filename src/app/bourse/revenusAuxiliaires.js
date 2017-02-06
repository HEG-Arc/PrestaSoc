class RevenusAuxiliairesController {
  /** @ngInject */
  constructor(simulation, $stateParams) {
    this.sim = simulation;
    this.index = $stateParams.index;
  }
}

export const revenusAuxiliaires = {
  template: require('./revenusAuxiliaires.html'),
  bindings: {
    personne: '<'
  },
  controller: RevenusAuxiliairesController
};

