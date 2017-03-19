class FormationController {
  /** @ngInject */
  constructor(simulation, regions, $stateParams, niveauxEtudes) {
    this.niveauxEtudes = niveauxEtudes.data;
    this.sim = simulation;
    this.index = $stateParams.index;
    this.filterList = txt => {
      return regions.search(txt);
    };
  }
}

export const formation = {
  template: require('./formation.html'),
  bindings: {
    personne: '<'
  },
  controller: FormationController
};

