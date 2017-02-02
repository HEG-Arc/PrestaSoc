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
  templateUrl: 'app/base/logement.html',
  controller: LogementController
};

