function sum(list) {
  return list.reduce((total, x) => total + x ? x : 0, 0);
}

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
      if (!person.estAdulte) {
        count++;
      }
      return count;
    }, 0);
  }

  calculRevenu() {
    let revenuBase = 0;
    if (this.sim.revenuActiviteLucrative) {
      revenuBase = (this.sim.revenuActiviteLucrative - this.deductionActiviteLucrative[this.couple]) * this.deductionActiviteLucrative.taux;
    }
    if (this.sim.revenuNetImposable) {
      revenuBase = this.sim.revenuNetImposable * this.deductionActiviteLucrative.taux;
    }

    const revenuPrevoyance = sum([this.sim.rentePrevoyanceProfessionelle, this.sim.rentePrevoyancePrivee]);

    const revenuRentes = sum([
      this.sim.renteAVS,
      this.sim.renteAI,
      this.sim.renteSurvivant,
      this.sim.renteAccident,
      this.sim.revenuInsertion]);

    /** We don't want a negative fortune */
    const totalFortune = Math.max(0, sum([this.sim.fortuneMobiliere,
      this.sim.dettesPrivees,
      this.sim.fortuneImmobiliereLogement,
      this.sim.dettesImmobiliereLogement,
      this.sim.fortuneImmobiliereAutre,
      this.sim.dettesImmobiliere]));

    // TODO: please name me
    const facteur = 0.04;
    const revenuFortune = this.sim.revenuFortune ? this.sim.revenuFortune : totalFortune * facteur;

    let deductionsFortune = this.franchiseFortune[this.couple];
    if (this.sim.estProprietaire) {
      if (this.sim.aConjointEMS || this.sim.aConjointProprietaire) {
        deductionsFortune += this.franchiseFortune.proprietaireAVSAI;
      } else {
        deductionsFortune += this.franchiseFortune.proprietaire;
      }
    }

    let imputationFortune = 0;
    let taux = 0;
    if (this.sim.renteAI) {
      taux = this.tauxPartFortune.ai;
    } else if (this.sim.renteSurvivant) {
      taux = this.tauxPartFortune.survivant;
    } else {
      taux = this.tauxPartFortune.avs;
    }
    if (totalFortune - deductionsFortune > 0) {
      imputationFortune = (totalFortune - deductionsFortune) * taux;
    }

    const revenus = sum([revenuBase + revenuPrevoyance + revenuRentes + revenuFortune + imputationFortune + this.sim.valeurLocativeLogement]);
    return {
      revenuBase, revenuPrevoyance, revenuRentes, revenuFortune,
      imputationFortune, valeurLocativeLogement: this.sim.valeurLocativeLogement, revenus
    };
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
    if (this.sim.personnes.length > 0) {
      this.couple = this.sim.personnes[0].etatCivil === 'C' ||
        this.sim.personnes[0].etatCivil === 'D' ||
        this.sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";
    }
    const estimationSubsidePC = () => {
      // WRONG calculeRevenue is object!
      // cache result to not compute twice!!
      if (this.calculDepenses() - this.calculRevenu() <= 0) {
        return 0;
      }
      return this.calculDepenses() - this.calculRevenu();
    };
    return {revenus: this.calculRevenu(), depenses: this.calculDepenses(), estimationPC: estimationSubsidePC()};
  }

}

export default CalculePC;
