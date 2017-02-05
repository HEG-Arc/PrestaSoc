class RevenusAuxiliairesController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const revenusAuxiliaires = {
  template: require('./revenusAuxiliaires.html'),
  controller: RevenusAuxiliairesController
};

