class CalculeBourse {

  /** @ngInject */
  constructor($http) {
    this.chargesNormalesBase = [];
    this.fraisEtude = [];
    this.chargesNormalesIndependant = [];
    this.fraisTransport = [];

    $http.get('app/bourse/chargesNormalesBase.json').then(resp => {
      this.chargesNormalesBase = resp.data;
    });
    $http.get('app/bourse/fraisEtude.json').then(resp => {
      this.fraisEtude = resp.data;
    });
    $http.get('app/bourse/chargesNormalesIndependant.json').then(resp => {
      this.chargesNormalesIndependant = resp.data;
    });
    $http.get('app/bourse/fraisTransport.json').then(resp => {
      this.fraisTransport = resp.data;
    });
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

  chargesNormalesBaseLookup(nbAdultes = 1, nbEnfants = 0, zone = 2) {
    return this.chargesNormalesBase.find(x => {
      return x.zone === zone &&
        x.nbAdultes === nbAdultes &&
        x.nbEnfants === nbEnfants;
    }).chargesNormales;
  }

  bourseEtudeCalcule(rdu) {
    let charges = 0;
    const revenus = rdu;
    let bourse = 0;
    // TODO zones bourses etudes
    const nbAdultes = this.sim.personnes.filter(personne => (personne.estAdulte)).length;
    const chargesNormalesBaseFoyer = this.chargesNormalesBaseLookup(nbAdultes);
    charges += chargesNormalesBaseFoyer;
    bourse = Math.min(revenus - charges, 0);
    bourse = Math.abs(bourse);
    return bourse;
  }

  bourseEtude(sim) {
    this.sim = sim;
    return this.bourseEtudeCalcule(this.calculRDU());
  }

}

export default CalculeBourse;
