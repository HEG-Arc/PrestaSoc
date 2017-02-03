class RevenuController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
  }
}

export const revenu = {
  template: require('./revenu.html'),
  controller: RevenuController
};

