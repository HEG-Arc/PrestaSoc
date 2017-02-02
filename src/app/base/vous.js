class VousController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const vous = {
  template: require('./vous.html'),
  controller: VousController
};

