const SUPPORTED_CANTON = ['VD', 'NE', 'GE'];

class VousController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
    if (this.sim.personnes.length === 0) {
      this.sim.personnes.push({prenom: 'Vous'});
    }
    // TODO: move somewhere centralized? generic test of all required parameters for each step to be valid?
    this.isCantonSupported = () => {
      return this.sim.lieuLogement && SUPPORTED_CANTON.indexOf(this.sim.lieuLogement.canton) > -1;
    };
    this.canContinue = () => {
      return this.sim.lieuLogement && this.isCantonSupported();
    };
  }
}

export const vous = {
  template: require('./vous.html'),
  controller: VousController
};

