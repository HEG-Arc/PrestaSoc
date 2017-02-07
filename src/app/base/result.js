class ResultController {
  /** @ngInject */
  constructor(lamalCalcule, simulation) {
    this.sim = simulation;
    this.lamalCalcule = lamalCalcule;
    this.lamalCalcule.subsideLamal(this.sim).then(result => {
      this.sim.subsidesLAMALTotal = result;
    });
  }
}

export const result = {
  template: require('./result.html'),
  controller: ResultController
};

