class FoyerController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;

    // TODO: move to service
    this.addPerson = () => {
      const personne = {};
      this.personne = personne;
      if (!angular.isArray(this.sim.persons)) {
        this.sim.personnes = [];
      }
      this.sim.personnes.push(personne);
    };

    this.removePerson = p => {
      this.sim.personnes.splice(this.sim.personnes.indexOf(p), 1);
    };
  }
}

export const foyer = {
  template: require('./foyer.html'),
  controller: FoyerController
};

