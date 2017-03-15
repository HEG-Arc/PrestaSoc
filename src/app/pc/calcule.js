function sum(list) {
  return list.reduce((total, x) => total + (isNaN(x) ? 0 : x), 0);
}

class CalculePC {

  /** @ngInject */
  constructor($http, $q) {
    this.subsidesLAMAL = [];
    this.$q = $q;
    const deferred = $q.defer();
    $http.get('app/pc/fraisAssuranceMaladie.json').then(resp => {
      this.subsidesLAMAL = resp.data;
    }).then(() => {
      deferred.resolve(true);
    });
    this.ready = deferred.promise;

    this.couvertureBesoinsVitaux = {couple: 28935, seul: 19290, enfants1: 10080, enfants2: 6720, enfants3: 3360};
    this.loyerAnnuelMaximum = {couple: 15000, seul: 13200, enfants: 15000, chaiseRoulante: 3600};
    this.fraisAccessoiresImmeuble = 1680;
    this.franchiseFortune = {couple: 60000, seul: 37500, enfant: 15000, proprietaire: 112500, proprietaireAVSAI: 300000};
    this.tauxPartFortune = {survivant: 0.067, avs: 0.1, ai: 0.067};
    this.deductionActiviteLucrative = {couple: 1500, seul: 1000, taux: 0.667};
    this.remboursementFraisMaladie = {couple: 50000, seul: 25000, ems: 6000};
    this.pcc.vd = {couple: 200, seul: 100};
  }

  testPC() {
    this.sim.revenuActiviteLucrative = 10000;
    this.sim.rentePrevoyanceProfessionelle = 5000;
    this.sim.rentePrevoyancePrivee = 5000;
    this.sim.renteAVSAI = 22000;
    this.sim.renteAI = 0;
    this.sim.renteSurvivant = 0;
    this.sim.renteAccident = 0;
    this.sim.revenuInsertion = 0;
    this.sim.fortuneMobiliere = 50000;
    this.sim.fortuneImmobiliereLogement = 120000;
    this.sim.fortuneImmobiliereAutre = 0;
    this.sim.dettesPrivees = 0;
    this.sim.dettesImmobiliereLogement = 20000;
    this.sim.dettesImmobiliere = 0;
    this.sim.estProprietaire = true;
    this.sim.aConjointEMS = false;
    this.sim.aConjointProprietaire = false;
    this.sim.logementValeurLocative = 9999;
    this.sim.logementLoyerBrut = 8888;
    this.sim.estLogementAccessible = false;
    this.sim.fraisAccessoiresLogement = 0;
    this.sim.lieuLogement = {canton: "AG", region: 0, prime: 5425};
    this.sim.depensesCotisationsAVS = 0;
    this.sim.contributionsEntretien = 0;
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

    const revenuPrevoyance = sum([this.sim.rentePrevoyanceProfessionelle + this.sim.rentePrevoyancePrivee]);

    const revenuRentes = sum([
      this.sim.renteAVSAI,
      this.sim.renteSurvivant,
      this.sim.renteAccident,
      this.sim.revenuInsertion]);

    /** We don't want a negative fortune */
    const totalFortune = Math.max(0, sum([this.sim.fortuneMobiliere,
      this.sim.fortuneImmobiliereLogement,
      this.sim.fortuneImmobiliereAutre]) -
      sum([this.sim.dettesPrivees,
        this.sim.dettesImmobiliereLogement,
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

    const revenus = Math.round(sum([revenuBase, revenuPrevoyance, revenuRentes, revenuFortune, imputationFortune, this.sim.logementValeurLocative]));
    return {
      revenuBase, revenuPrevoyance, revenuRentes, revenuFortune,
      imputationFortune, valeurLocativeLogement: this.sim.logementValeurLocative, revenus
    };
  }

  calculDepenses() {
    /** =RECHERCHEV(cellule_familiale;besoins_vitaux;2;FAUX)+SI(nb_enfants>0;SI(nb_enfants<3;nb_enfants*C6;SI(nb_enfants<5;2*C6+(nb_enfants-2)*C7;2*C6+2*C7+(nb_enfants-4)*C8))) */
    let besoinsVitaux = this.couvertureBesoinsVitaux[this.couple];
    if (this.nombreEnfants > 0) {
      if (this.nombreEnfants < 3) {
        besoinsVitaux += this.nombreEnfants * this.couvertureBesoinsVitaux.enfants1;
      } else if (this.nombreEnfants < 5) {
        besoinsVitaux += 2 * this.couvertureBesoinsVitaux.enfants1 + (this.nombreEnfants - 2) * this.couvertureBesoinsVitaux.enfants2;
      } else {
        besoinsVitaux += 2 * this.couvertureBesoinsVitaux.enfants1 + 2 * this.couvertureBesoinsVitaux.enfants2 + (this.nombreEnfants - 4) * this.couvertureBesoinsVitaux.enfants3;
      }
    }

    /** =SI(C37="locataire";
               SI(nb_enfants>0;SI(C52<RECHERCHEV("enfants";loyer_maximum;2;FAUX);C52;RECHERCHEV("enfants";loyer_maximum;2;FAUX));
                                    SI(C52<RECHERCHEV(cellule_familiale;loyer_maximum;2;FAUX);C52;RECHERCHEV(cellule_familiale;loyer_maximum;2;FAUX)));
          SI(C37="propriétaire";
              SI(nb_enfants>0;SI(C53<RECHERCHEV("enfants";loyer_maximum;2;FAUX);C53;RECHERCHEV("enfants";loyer_maximum;2;FAUX));
                                    SI(C53<RECHERCHEV(cellule_familiale;loyer_maximum;2;FAUX);C53;RECHERCHEV(cellule_familiale;loyer_maximum;2;FAUX)))
              +frais_accessoires_immeuble)
        )
        +SI(logement_accessible;C14;0) */
    let loyerBrut = 0;
    if (this.nombreEnfants > 0) {
      loyerBrut = this.loyerAnnuelMaximum.enfants;
    } else {
      loyerBrut = this.loyerAnnuelMaximum[this.couple];
    }
    if (this.sim.estLogementAccessible) {
      loyerBrut += this.loyerAnnuelMaximum.chaiseRoulante;
    }

    let logementLoyerBrut = 0;
    if (this.sim.logementLoyerBrut) {
      logementLoyerBrut = this.sim.logementLoyerBrut;
    }

    let depensesLoyer = Math.min(loyerBrut, logementLoyerBrut);
    if (this.sim.logement === 'estProprietaire') {
      depensesLoyer += Math.min(this.fraisAccessoiresImmeuble, this.sim.fraisAccessoiresLogement);
    }

    let primeMaladie = {};
    primeMaladie = this.subsidesLAMAL.find(x => {
      return x.region === this.sim.lieuLogement.region &&
        x.canton === this.sim.lieuLogement.canton;
    });
    const primesAssuranceMaladie = primeMaladie.prime * this.sim.personnes.length;

    const cotisationsAVS = sum([this.sim.depensesCotisationsAVS]);
    const contributionsEntretien = sum([this.sim.depensesContributionsEntretien]);

    const depenses = Math.round(sum([besoinsVitaux, depensesLoyer, primesAssuranceMaladie, cotisationsAVS, contributionsEntretien]));
    return {besoinsVitaux, depensesLoyer, primesAssuranceMaladie, primeMaladie, cotisationsAVS, contributionsEntretien, depenses};
  }

  subsidePC(sim) {
    this.sim = sim;
    return this.ready.then(() => {
      this.nombreEnfants = this.calculeNombreEnfants();
      if (this.sim.personnes.length > 0) {
        this.couple = this.sim.personnes[0].etatCivil === 'C' ||
          this.sim.personnes[0].etatCivil === 'D' ||
          this.sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";
      }

      if (this.sim.personnes[0].estBeneficiaireAVS || this.sim.personnes[0].estBeneficiaireAI) {
        const revenus = Math.round(this.calculRevenu() / 10) * 10;
        const depenses = Math.round(this.calculDepenses() / 10) * 10;
        let estimationSubsidePC = 0;
        if (depenses.depenses - revenus.revenus > 0) {
          estimationSubsidePC = Math.round((depenses.depenses - revenus.revenus) / 10) * 10;
        }
        const estimationSubsidePCMensuel = Math.round(estimationSubsidePC / 120) * 10;

        let subsideFraisMaladie = 0;
        if (estimationSubsidePC > 0) {
          subsideFraisMaladie = this.remboursementFraisMaladie[this.couple];
        }
        return {conditions: true, revenus, depenses, estimationSubsidePC, estimationSubsidePCMensuel, subsideFraisMaladie};
      }
      return {conditions: false};
    });
  }

}

export default CalculePC;
