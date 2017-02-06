class EstimationController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
    this.text = 'Estimation subsides LAMAL';
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};

