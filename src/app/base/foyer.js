class FoyerController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;

    // TODO: move to service
    this.addPerson = () => {
      const person = {};
      this.currentPerson = person;
      if (!angular.isArray(this.sim.persons)) {
        this.sim.persons = [];
      }
      this.sim.persons.push(person);
    };

    this.removePerson = p => {
      this.sim.persons.splice(this.sim.persons.indexOf(p), 1);
    };
  }
}

export const foyer = {
  template: require('./foyer.html'),
  controller: FoyerController
};

