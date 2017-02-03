class FortuneController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const fortune = {
  template: require('./fortune.html'),
  controller: FortuneController
};

