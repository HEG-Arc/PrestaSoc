class VousController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const vous = {
  templateUrl: 'app/base/vous.html',
  controller: VousController
};

