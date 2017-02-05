class VousController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
    if (this.sim.personnes.length === 0) {
      this.sim.personnes.push({prenom: 'Vous'});
    }
  }
}

export const vous = {
  template: require('./vous.html'),
  controller: VousController
};

