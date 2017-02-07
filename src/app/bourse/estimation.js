class EstimationController {
  /** @ngInject */
  constructor(bourseCalcule, simulation) {
    this.sim = simulation;
    this.bourseCalcule = bourseCalcule;
    this.bourseCalcule.bourseEtude(this.sim).then(result => {
      this.sim.bourseEtude = result;
    });
  }
}

export const estimation = {
  template: require('./estimation.html'),
  controller: EstimationController
};

