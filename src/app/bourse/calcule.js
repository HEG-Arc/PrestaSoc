import {calculRDU} from '../calculateur/calculRDU';

class CalculeBourse {

  /** @ngInject */
  constructor($http, $q) {
    this.chargesNormalesBase = [];
    this.fraisEtude = [];
    this.chargesNormalesIndependant = [];
    this.fraisTransport = [];
    this.chargesNormalesComplementaires = [];
    this.$q = $q;
    const deferred = $q.defer();

    $q.all([
      $http.get('app/bourse/chargesNormalesBase.json').then(resp => {
        this.chargesNormalesBase = resp.data;
      }),
      $http.get('app/bourse/fraisEtude.json').then(resp => {
        this.fraisEtude = resp.data;
      }),
      $http.get('app/bourse/chargesNormalesComplementaires.json').then(resp => {
        this.chargesNormalesComplementaires = resp.data;
      }),
      $http.get('app/bourse/chargesNormalesIndependant.json').then(resp => {
        this.chargesNormalesIndependant = resp.data;
      }),
      $http.get('app/bourse/fraisTransport.json').then(resp => {
        this.fraisTransport = resp.data;
      })
    ]).then(() => {
      deferred.resolve(true);
    });
    this.ready = deferred.promise;
  }

  nombreEnfants() {
    return this.sim.personnes.filter(personne => (!personne.estAdulte)).length;
  }

  chargesNormalesBaseLookup(nbAdultes = 1, nbEnfants = 0, zone = 2) {
    return this.chargesNormalesBase.find(x => {
      return x.zone === zone &&
        x.nbAdultes === nbAdultes &&
        x.nbEnfants === nbEnfants;
    }).chargesNormales;
  }

  chargesNormalesIndependantLookup(nbAdultes = 1, nbEnfants = 0, zone = 2) {
    return this.chargesNormalesIndependant.find(x => {
      return x.zone === zone &&
        x.nbAdultes === nbAdultes &&
        x.nbEnfants === nbEnfants;
    }).chargesNormales;
  }

  chargesNormalesComplementairesLookup(age) {
    return this.chargesNormalesComplementaires.find(x => {
      return x.ageMin <= age &&
        x.ageMax >= age;
    }).forfait;
  }

  bourseEtudeCalcule(rdu, etudiant) {
    const charges = [];
    const revenus = [];
    let montantBourse = 0;
    // TODO zones bourses etudes
    const nbAdultes = this.sim.personnes.filter(personne => (personne.estAdulte)).length;
    const nbEnfants = this.nombreEnfants(this.sim);
    let chargesNormalesBaseFoyer = 0;
    if (etudiant.estIndependanceFinanciere) {
      chargesNormalesBaseFoyer = this.chargesNormalesIndependantLookup(nbAdultes);
    } else {
      chargesNormalesBaseFoyer = this.chargesNormalesBaseLookup(nbAdultes, nbEnfants);
    }
    charges.push(["chargesNormalesBaseFoyer", chargesNormalesBaseFoyer]);

    const chargesNormalesComplementaires = this.chargesNormalesComplementairesLookup(etudiant.age);
    charges.push(["chargesNormalesComplementaires", chargesNormalesComplementaires]);

    const fraisRepasForfait = 1500;
    charges.push(["fraisRepasForfait", fraisRepasForfait]);

    if (etudiant.aLogementSepare) {
      const fraisLogementSepareForfait = (500 + 280) * 10;
      charges.push(["fraisLogementSepareForfait", fraisLogementSepareForfait]);
    }
    // TODO compute frais transports
    const fraisTransportForfait = 1000;
    charges.push(["fraisTransportForfait", fraisTransportForfait]);

    // TODO compute frais etudes
    let fraisEtudeForfait = 0;
    switch (etudiant.niveauEtude) {
      case 'l2': fraisEtudeForfait = 1500;
        break;
      case 'l3': fraisEtudeForfait = 2500;
        break;
      default: break;
    }
    charges.push(["fraisEtudeForfait", fraisEtudeForfait]);

    revenus.push(["rdu", rdu]);
    if (etudiant.revenueAuxiliaireContributionsEntretien) {
      revenus.push(["revenueAuxiliaireContributionsEntretien", etudiant.revenueAuxiliaireContributionsEntretien]);
    }
    if (etudiant.revenueAuxiliairesAutresPrestationsFinancieres) {
      revenus.push(["revenueAuxiliairesAutresPrestationsFinancieres", etudiant.revenueAuxiliairesAutresPrestationsFinancieres]);
    }

    // TODO part contributive des autres parents

    // TODO charges fiscales
    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    const bourseEtude = {charges, revenus, chargesTotales, revenusTotaux, montantBourse};
    etudiant.bourseEtude = bourseEtude;
    return bourseEtude;
  }

  bourseEtude(sim) {
    this.sim = sim;
    return this.ready.then(() => {
      const bourses = [];
      for (let i = 0; i < this.sim.etudiants.length; i++) {
        bourses.push(this.bourseEtudeCalcule(calculRDU(this.sim), this.sim.etudiants[i]));
      }
      return bourses;
    });
  }

}

export default CalculeBourse;
