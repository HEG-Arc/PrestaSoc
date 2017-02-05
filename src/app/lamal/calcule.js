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

  subsideLamalCalcule(rdu) {
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
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
    return this.subsideLamalCalcule(this.calculRDU());
  }

  calculRDU() {
    const nombreEnfants = function (personnes) {
      return personnes.reduce((count, person) => {
        if (!person.estAdulte) {
          count++;
        }
        return count;
      }, 0);
    };

    const reductionEnfants = function (enfants) {
      const table = new Map();
      table.set(0, (x => 0));
      table.set(1, (x => 6000));
      table.set(2, (x => 13000));
      table.set(3, (x => 7000 * x));
      const reduction = table.get(Math.min(enfants, table.size - 1))(enfants);
      return reduction;
    };

    const imputationFortune = function (sim) {
      const franchiseFortune = {
        seul: 56000,
        couple: 112000
      };
      const tauxMajoration = 1 / 15;
      const menageRDU = sim.etatCivil === 'C' ||
        sim.etatCivil === 'D' ||
        sim.etatCivil === 'V' ? "seul" : "couple";
      let fortune = sim.fortuneImmobiliereLogement;
      fortune -= Math.min(300000, sim.fortuneImmobiliereLogement);
      fortune += sim.fortuneImmobiliereAutre;
      fortune += sim.fortuneMobiliere;
      fortune -= franchiseFortune[menageRDU];
      fortune = Math.max(fortune, 0);
      return fortune * tauxMajoration;
    };
    const nbEnfants = nombreEnfants(this.sim.personnes);

    let rdu = this.sim.revenuNetImposable;
    rdu += this.sim.rentePrevoyancePrivee;
    rdu -= this.sim.fraisAccessoiresLogement;
    rdu -= reductionEnfants(nbEnfants);
    rdu += imputationFortune();
    return rdu;
  }

}

export default CalculeLamal;
