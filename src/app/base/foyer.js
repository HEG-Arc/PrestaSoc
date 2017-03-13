class FoyerController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;

    if (this.sim.personnes[0].prenom === '') {
      this.sim.personnes[0].prenom = 'Vous';
    }

    // TODO: move to service
    this.addPerson = () => {
      const personne = {};
      this.personne = personne;
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

