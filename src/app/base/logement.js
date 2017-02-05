class LogementController {
  /** @ngInject */
  constructor(simulation, regions, $scope) {
    this.sim = simulation;
    this.filterList = txt => {
      return regions.search(txt);
    };
    $scope.$watch('$ctrl.sim.logement', () => {
      if (this.logement === 'estLocataire') {
        this.sim.estLocataire = true;
        this.sim.estProprietaire = false;
        this.sim.estEMS = false;
      }
      if (this.logement === 'estProprietaire') {
        this.sim.estLocataire = false;
        this.sim.estProprietaire = true;
        this.sim.estEMS = false;
      }
      if (this.logement === 'estEMS') {
        this.sim.estLocataire = false;
        this.sim.estProprietaire = false;
        this.sim.estEMS = true;
      }
    });
  }
}

export const logement = {
  template: require('./logement.html'),
  controller: LogementController
};

