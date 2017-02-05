class EstimationController {
  /** @ngInject */
  constructor(simulation, lamalCalcule) {
    this.sim = simulation;
    this.text = 'lamal estimation';
    this.lamalCalcule = lamalCalcule;
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};

