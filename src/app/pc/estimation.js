class EstimationController {
  constructor(simulation, pcCalcule) {
    this.text = 'PC estimation';
    this.sim = simulation;
    pcCalcule.subsidePC(simulation).then(result => {
      this.sim.pc = result;
    });
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};
