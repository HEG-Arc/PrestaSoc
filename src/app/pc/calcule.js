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
    const revenuBase = () => {
      if (this.sim.revenuActiviteLucrative) {
        return (this.sim.revenuActiviteLucrative - this.deductionActiviteLucrative[this.couple]) * this.deductionActiviteLucrative.taux;
      } else if (this.sim.revenuNetImposable) {
        return this.sim.revenuNetImposable * this.deductionActiviteLucrative.taux;
      }
      return 0;
    };

    const revenuPrevoyance = () => {
      let revenu = 0;
      if (this.sim.rentePrevoyanceProfessionelle) {
        revenu += this.sim.rentePrevoyanceProfessionelle;
      }
      if (this.sim.rentePrevoyancePrivee) {
        revenu += this.sim.rentePrevoyancePrivee;
      }
      return revenu;
    };

    const revenuRentes = () => {
      let revenu = 0;
      if (this.sim.renteAVS) {
        revenu += this.sim.renteAVS;
      }
      if (this.sim.renteAI) {
        revenu += this.sim.renteAI;
      }
      if (this.sim.renteSurvivant) {
        revenu += this.sim.renteSurvivant;
      }
      if (this.sim.renteAccident) {
        revenu += this.sim.renteAccident;
      }
      if (this.sim.revenuInsertion) {
        revenu += this.sim.revenuInsertion;
      }
      return revenu;
    };

    const totalFortune = () => {
      let revenu = 0;
      if (this.sim.fortuneMobiliere) {
        revenu += this.sim.fortuneMobiliere;
      }
      if (this.sim.dettesPrivees) {
        revenu -= this.sim.dettesPrivees;
      }
      if (this.sim.fortuneImmobiliereLogement) {
        revenu += this.sim.fortuneImmobiliereLogement;
      }
      if (this.sim.dettesImmobiliereLogement) {
        revenu -= this.sim.dettesImmobiliereLogement;
      }
      if (this.sim.fortuneImmobiliereAutre) {
        revenu += this.sim.fortuneImmobiliereAutre;
      }
      if (this.sim.dettesImmobiliere) {
        revenu -= this.sim.dettesImmobiliere;
      }
      if (revenu > 0) {
        return revenu;
      }
      /** We don't want a negative fortune */
      return 0;
    };

    const revenuFortune = () => {
      if (this.sim.revenuFortune) {
        return this.sim.revenuFortune;
      }
      return totalFortune() * 0.04;
    };

    const deductionsFortune = () => {
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

    const imputationFortune = () => {
      let taux = 0;
      if (this.sim.renteAI) {
        taux = this.tauxPartFortune.ai;
      } else if (this.sim.renteSurvivant) {
        taux = this.tauxPartFortune.survivant;
      } else {
        taux = this.tauxPartFortune.avs;
      }
      if (totalFortune() - deductionsFortune() > 0) {
        return (totalFortune() - deductionsFortune()) * taux;
      }
      return 0;
    };

    const valeurLocativeLogement = () => {
      if (this.sim.valeurLocativeLogement) {
        return this.sim.valeurLocativeLogement;
      }
      return 0;
    };

    const revenus = revenuBase() + revenuPrevoyance() + revenuRentes() + revenuFortune() + imputationFortune() + valeurLocativeLogement();
    return {revenuBase: revenuBase(), revenuPrevoyance: revenuPrevoyance(), revenuRentes: revenuRentes(), revenuFortune: revenuFortune(),
      imputationFortune: imputationFortune(), valeurLocativeLogement: valeurLocativeLogement(), revenus};
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
      if (this.calculDepenses() - this.calculRevenu() <= 0) {
        return 0;
      }
      return this.calculDepenses() - this.calculRevenu();
    };
    return {revenus: this.calculRevenu(), depenses: this.calculDepenses(), estimationPC: estimationSubsidePC()};
  }

}

export default CalculePC;
