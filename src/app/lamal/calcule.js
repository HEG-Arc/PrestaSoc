class CalculeLamal {

  /** @ngInject */
  constructor($http) {
    $http.get('app/lamal/lamalVDSubsidesRDU.json').then(resp => {
      this.subsidesRDU = resp.data;
    });
    $http.get('app/lamal/lamalVDSubsidesRIPC.json').then(resp => {
      this.subsidesRIPC = resp.data;
    });
  }

  subsideLookup(menage, estEtudiant = false, estBeneficiarePC = false
                , estBeneficiareRI = false, age, rdu, region) {
    let subside = {};
    if (estBeneficiarePC || estBeneficiareRI) {
      subside = this.subsidesRIPC.find(x => {
        return x.menage === menage &&
          x.formation === estEtudiant &&
          x.ageMin <= age &&
          x.ageMax >= age &&
          x.region === region;
      });
    } else {
      subside = this.subsidesRDU.find(x => {
        return x.menage === menage &&
          x.formation === estEtudiant &&
          x.ageMin <= age &&
          x.ageMax >= age &&
          x.rduMin <= rdu &&
          x.rduMax >= rdu;
      });
    }
    if (angular.isDefined(subside)) {
      const subsideEstime = Math.round(subside.subsideMin + (1 - (rdu - subside.rduMin) / (subside.rduMax - subside.rduMin)) *
        (subside.subsideMax - subside.subsideMin));
      return {subsideMin: subside.subsideMin, subsideMax: subside.subsideMax, subsideEstime};
    }
    return {subsideMin: 0, subsideMax: 0, subsideEstime: 0};
  }

  subsideLamalCalcule(rdu) {
    if (!this.sim.lieuLogement) {
      return 0;
    }
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
    const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0};
    for (let i = 0; i < this.sim.personnes.length; i++) {
      const person = this.sim.personnes[i];
      person.subsideLamal = this.subsideLookup(menage, person.estEtudiant, person.estBeneficiarePC
                                              , person.estBeneficiareRI, person.age, rdu
                                              , this.sim.lieuLogement.region);
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
    const nombreEnfants = function (sim) {
      return sim.personnes.reduce((count, person) => {
        if (!person.estAdulte) {
          count++;
        }
        return count;
      }, 0);
    };

    const reductionEnfants = function (nbEnfants) {
      switch (nbEnfants) {
        case 0:
          return 0;
        case 1:
          return 6000;
        case 2:
          return 13000;
        default:
          return 7000 * nbEnfants;
      }
    };

    const imputationFortune = function (sim) {
      const franchiseFortune = {
        seul: 56000,
        couple: 112000
      };
      const tauxMajoration = 1 / 15;
      const menageRDU = sim.personnes[0].etatCivil === 'C' ||
        sim.personnes[0].etatCivil === 'D' ||
        sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";

      let fortune = 0;
      if (angular.isDefined(sim.fortuneImmobiliereLogement)) {
        fortune += parseInt(sim.fortuneImmobiliereLogement, 10);
        fortune -= Math.min(300000, parseInt(sim.fortuneImmobiliereLogement, 10));
      }
      if (angular.isDefined(sim.fortuneImmobiliereAutre)) {
        fortune += parseInt(sim.fortuneImmobiliereAutre, 10);
      }
      if (angular.isDefined(sim.fortuneMobiliere)) {
        fortune += parseInt(sim.fortuneMobiliere, 10);
      }
      fortune -= franchiseFortune[menageRDU];
      fortune = Math.max(fortune, 0);
      return fortune * tauxMajoration;
    };

    let rdu = 0;
    if (angular.isDefined(this.sim.revenuNetImposable)) {
      rdu += parseInt(this.sim.revenuNetImposable, 10);
    }
    if (angular.isDefined(this.sim.rentePrevoyancePrivee)) {
      rdu += parseInt(this.sim.rentePrevoyancePrivee, 10);
    }
    if (angular.isDefined(this.sim.fraisAccessoiresLogement)) {
      rdu -= parseInt(this.sim.fraisAccessoiresLogement, 10);
    }
    const nbEnfants = nombreEnfants(this.sim);
    rdu -= reductionEnfants(nbEnfants);
    rdu += imputationFortune(this.sim);
    return rdu;
  }

}

export default CalculeLamal;
