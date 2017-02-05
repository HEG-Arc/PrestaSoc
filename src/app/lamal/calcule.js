class CalculeLamal {

  /** @ngInject */
  constructor($http) {
    $http.get('app/lamal/lamalVDSubsidesRDU.json').then(resp => {
      this.subsides = resp.data;
    });
  }

  rduLookup(menage, estEtudiant = 0, age, rdu) {
    const subside = this.subsides.find(x => {
      return x.menage === menage &&
             x.formation === estEtudiant &&
             x.ageMin <= age &&
             x.ageMax >= age &&
             x.rduMin <= rdu &&
             x.rduMax >= rdu;
    });
    const subsideEstime = Math.round(rdu.subsideMin + (1 - (rdu - subside.rduMin) / (subside.rduMax - subside.rduMin)) * (subside.subsideMax - subside.subsideMin));
    return {subsideMin: subside.subsideMin, subsideMax: rdu.subsideMax, subsideEstime};
  }

  subsideLamalCalcule() {
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
    const rdu = 0;
    const subsideTotal = this.sim.personnes.reduce((total, person) => {
      return total + this.rduLookup(menage, person.estEtudiant, this.sim.age(person), rdu).subsideEstime;
    }, 0);

    return subsideTotal;
  }

  subsideMax() {
    return 100;
  }

  subsideLamal(sim) {
    this.sim = sim;
    // TODO minmax
    return Math.min(this.subsideLamalCalcule(), this.subsideMax());
  }
}

export default CalculeLamal;
