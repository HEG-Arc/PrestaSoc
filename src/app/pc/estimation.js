class EstimationController {
  constructor(simulation, pcCalcule) {
    this.text = 'PC estimation';
    this.sim = simulation;
    this.sim.pc = pcCalcule.subsidePC(simulation);
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};
