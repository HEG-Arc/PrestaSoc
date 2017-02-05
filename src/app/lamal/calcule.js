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
    return {subsideMin: subside.subsideMin, subsideMax: subside.subsideMax, subsideEstime};
  }

  subsideLamalCalcule() {
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
    const rdu = 0;
    const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0};
    for (let i = 0; i < this.sim.personnes.length; i++) {
      const person = this.sim.personnes[i];
      person.subsideLamal = this.rduLookup(menage, person.estEtudiant, this.sim.age(person), rdu);
      subsideTotal.subsideEstime += person.subsideLamal.subsideEstime;
      subsideTotal.subsideMin += person.subsideLamal.subsideMin;
      subsideTotal.subsideMax += person.subsideLamal.subsideMax;
    }
    return subsideTotal;
  }

  subsideLamal(sim) {
    this.sim = sim;
    return this.subsideLamalCalcule();
  }
}

export default CalculeLamal;
