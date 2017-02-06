class EtudiantsController {
  /** @ngInject */
  constructor(simulation, $stateParams) {
    this.sim = simulation;
    this.index = $stateParams.index;
  }
}

export const etudiants = {
  template: require('./etudiants.html'),
  controller: EtudiantsController
};
