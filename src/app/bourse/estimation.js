class EstimationController {
  /** @ngInject */
  constructor(bourseCalcule, simulation) {
    this.sim = simulation;
    this.bourseCalcule = bourseCalcule;
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};

