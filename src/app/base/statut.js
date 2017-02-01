class StatutController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const statut = {
  templateUrl: 'app/base/statut.html',
  controller: StatutController
};

