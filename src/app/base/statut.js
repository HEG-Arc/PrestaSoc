class StatutController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const statut = {
  template: require('./statut.html'),
  controller: StatutController
};

