class ResultController {
  /** @ngInject */
  constructor(lamalCalcule, simulation) {
    this.text = 'Résultats';
    this.sim = simulation;
    this.lamalCalcule = lamalCalcule;
    this.sim.subsidesLAMALTotal = this.lamalCalcule.subsideLamal(this.sim);
  }
}

export const result = {
  template: require('./result.html'),
  controller: ResultController
};

