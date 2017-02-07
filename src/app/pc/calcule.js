function sum(list) {
  return list.reduce((total, x) => total + (isNaN(x) ? 0 : x), 0);
}

class CalculePC {

  /** @ngInject */
  constructor($http, $q) {
    this.subsidesLAMAL = {};
    this.$q = $q;
    const deferred = $q.defer();
    $q.all([
      $http.get('app/pc/fraisAssuranceMaladie.json').then(resp => {
        this.subsidesLAMAL = resp.data;
      })
    ]).then(() => {
      deferred.resolve(true);
    });
    this.ready = deferred.promise;

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

    const revenuPrevoyance = sum([this.sim.rentePrevoyanceProfessionelle + this.sim.rentePrevoyancePrivee]);

    const revenuRentes = sum([
      this.sim.renteAVS,
      this.sim.renteAI,
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

    const revenus = sum([revenuBase, revenuPrevoyance, revenuRentes, revenuFortune, imputationFortune, this.sim.logementValeurLocative]);
    return {
      revenuBase, revenuPrevoyance, revenuRentes, revenuFortune,
      imputationFortune, valeurLocativeLogement: this.sim.valeurLocativeLogement, revenus
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

    let depensesLoyer = Math.min(loyerBrut, this.sim.logementLoyerBrut);
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

    const depenses = sum([besoinsVitaux, depensesLoyer, primesAssuranceMaladie, cotisationsAVS, contributionsEntretien]);
    return {besoinsVitaux, depensesLoyer, primesAssuranceMaladie, primeMaladie, cotisationsAVS, contributionsEntretien, depenses};
  }

  subsidePC(sim) {
    this.sim = sim;
    this.nombreEnfants = this.calculeNombreEnfants();
    if (this.sim.personnes.length > 0) {
      this.couple = this.sim.personnes[0].etatCivil === 'C' ||
        this.sim.personnes[0].etatCivil === 'D' ||
        this.sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";
    }


    let estimationSubsidePC = 0;
    if (depenses.depenses - revenus.revenus > 0) {
      estimationSubsidePC = depenses.depenses - revenus.revenus;
    }
    const estimationSubsidePCMensuel = estimationSubsidePC / 12;
    return {revenus, depenses, estimationSubsidePC, estimationSubsidePCMensuel};
  }

}

export default CalculePC;
