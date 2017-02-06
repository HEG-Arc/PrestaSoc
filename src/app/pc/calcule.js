class CalculePC {

  /** @ngInject */
  constructor($http) {
    $http.get('app/lamal/lamalVDSubsidesRDU.json').then(resp => {
      this.subsides = resp.data;
    });
    this.couvertureBesoinsVitaux = {couple: 28935, seul: 19290, enfants1: 10080, enfants2: 6720, enfants3: 3360};
    this.loyerAnnuelMaximum = {couple: 15000, seul: 13200, enfants: 15000, chaiseRoulante: 3600};
    this.fraisAccessoiresImmeuble = 1680;
    this.franchiseFortune = {couple: 60000, seul: 37500, proprietaire: 112500, proprietaireAVSAI: 300000};
    this.tauxPartFortune = {survivant: 0.067, avs: 0.1, ai: 0.067};
    this.deductionActiviteLucrative = {couple: 1500, seul: 1000, taux: 0.667};
  }

  calculeNombreEnfants() {
    return this.sim.personnes.reduce((count, person) => {
      if (person.estAdulte) {
        count++;
      }
      return count;
    }, 0);
  }

  calculRevenu() {
    const revenuBase = function () {
      if (this.sim.revenuActiviteLucrative) {
        return (this.sim.revenuActiviteLucrative - this.deductionActiviteLucrative[this.couple]) * this.deductionActiviteLucrative.taux;
      } else if (this.sim.revenuNetImposable) {
        return this.sim.revenuNetImposable * this.deductionActiviteLucrative.taux;
      }
      return 0;
    };

    const revenuPrevoyance = this.sim.rentePrevoyanceProfessionelle + this.sim.rentePrevoyancePrivee;
    const revenuRentes = this.sim.renteAVS + this.sim.renteAI + this.sim.renteSurvivant + this.sim.renteAccident + this.sim.revenuInsertion;
    const totalFortune = this.sim.fortuneMobiliere - this.sim.dettesPrivees +
                         this.sim.fortuneImmobiliereLogement - this.sim.dettesImmobiliereLogement +
                         this.sim.fortuneImmobiliereAutre - this.sim.dettesImmobiliere;

    const revenuFortune = function () {
      if (this.sim.revenuFortune) {
        return this.sim.revenuFortune;
      }
      return totalFortune * 0.04;
    };

    const fortuneAvecDeductions = function () {
      let deductionsFortune = this.franchiseFortune[this.couple];
      if (this.sim.logement === 'estProprietaire') {
        if (this.sim.aConjointEMS || this.sim.aConjointProprietaire) {
          deductionsFortune += this.franchiseFortune.proprietaireAVSAI;
        } else {
          deductionsFortune += this.franchiseFortune.proprietaire;
        }
      }
      return deductionsFortune;
    };

    const imputationFortune = function () {
      let taux = 0;
      if (this.sim.renteAI) {
        taux = this.tauxPartFortune.ai;
      } else if (this.sim.renteSurvivant) {
        taux = this.tauxPartFortune.survivant;
      } else {
        taux = this.tauxPartFortune.avs;
      }
      return (totalFortune - fortuneAvecDeductions) * taux;
    };
    /** TODO: Ajouter valeur locative */
    return revenuBase + revenuPrevoyance + revenuRentes + revenuFortune + imputationFortune;
  }

  calculDepenses() {
    const besoinsVitaux = 0 * this.nombreEnfants;
    const loyerBrut = 0;
    const primesAssuranceMaladie = 0;
    const cotisationsAVS = 0;
    const contributionsEntretien = 0;

    return besoinsVitaux + loyerBrut + primesAssuranceMaladie + cotisationsAVS + contributionsEntretien;
  }

  subsidePC(sim) {
    this.sim = sim;
    this.nombreEnfants = this.calculeNombreEnfants();
    this.couple = this.sim.personnes[0].etatCivil === 'C' ||
      this.sim.personnes[0].etatCivil === 'D' ||
      this.sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";

    return {revenu: this.calculRevenu(), depenses: this.calculRevenu(), estimationPC: this.calculDepenses() - this.calculRevenu()};
  }

}

export default CalculePC;
