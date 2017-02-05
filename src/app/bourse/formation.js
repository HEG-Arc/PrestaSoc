class FormationController {
  /** @ngInject */
  constructor(simulation, regions) {
    this.sim = simulation;
    this.filterList = txt => {
      return regions.search(txt);
    };
  }
}

export const formation = {
  template: require('./formation.html'),
  controller: FormationController
};

