class LogementController {
  /** @ngInject */
  constructor(simulation, regions) {
    this.sim = simulation;
    this.filterList = txt => {
      return regions.search(txt);
    };
  }
}

export const logement = {
  template: require('./logement.html'),
  controller: LogementController
};

