class ResultController {
  /** @ngInject */
  constructor(lamalCalcule, pcCalcule, simulation) {
    this.sim = simulation;
    this.lamalCalcule = lamalCalcule;
    this.lamalCalcule.subsideLamal(this.sim).then(result => {
      this.sim.subsidesLAMALTotal = result;
    });
    pcCalcule.subsidePC(simulation).then(result => {
      this.sim.pc = result;
    });
  }
}

export const result = {
  template: require('./result.html'),
  controller: ResultController
};

