import {calculRDU} from '../calculateur/calculRDUVD';

// REF http://www.guidesocial.ch/fr/fiche/960/
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

    if (etudiant.aParentLogementAutreFoyer) {
      const etatCivilFoyer2 = etudiant.nbAdultesFoyer2 > 1 ? 'M' : 'C'; // FIXME etat civil 2e foyer
      const rduData = {revenuNetImposable: etudiant.revenuNetFoyer2,
        fortuneImmobiliereLogement: etudiant.fortuneImmobiliereFoyer2,
        fortuneImmobiliereAutre: etudiant.autresFortuneImmobiliereFoyer2,
        fortuneMobiliere: etudiant.fortuneMobiliereFoyer2,
        fraisAccessoiresLogement: etudiant.fraisAccessoiresFoyer2,
        personnes: [{etatCivil: etatCivilFoyer2}]
        // rentePrevoyancePrivee
      };

      const rduFoyer2 = calculRDU(rduData);
      revenus.push(["revenuFoyer2", rduFoyer2]);
      const chargesNormalesBaseFoyer2 = this.chargesNormalesBaseLookup(etudiant.nbAdultesFoyer2, etudiant.nbEnfantsFoyer2);
      // TODO faudrait-il prendre en compte le nombre d'étudiants dans le 2e foyer pour calculer leurs charges?
      charges.push(["chargesNormalesBaseFoyer2", chargesNormalesBaseFoyer2]);
    }

    // TODO charges fiscales
    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    // TODO si le revenu est égal à l'ensemble des charges, l'OCBE octroie une aide pour les frais d'études uniquement;
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

  bourseEtudeTest() {
    this.sim = angular.fromJson('{"personnes":[{"prenom":"John","age":22,"estAdulte":true,"dateNaissance":"1994- 12 - 31T23:00:00.000Z","etatCivil":"C","estEtudiant":true,"niveauEtude":"l3","subsideLamal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331},"$$searchText":"1000 Lausanne","lieuInstitution":{"cas":"","npa":1000,"localite":"Lausanne 25","canton":"VD","region":1,"no":5586,"commune":"Lausanne","district":"DISTRICT DE LAUSANNE","label":"1000 Lausanne"},"aParentLogementAutreFoyer":true,"revenueAuxiliaireContributionsEntretien":200,"nbAdultesFoyer2":1,"nbEnfantsFoyer2":1,"revenuNetFoyer2":12000,"estProprietaireFoyer2":true,"fortuneImmobiliereFoyer2":150000,"bourseEtude":{"charges":[["chargesNormalesBaseFoyer",1960],["chargesNormalesComplementaires",3500],["fraisRepasForfait",1500],["fraisTransportForfait",1000],["fraisEtudeForfait",2500]],"revenus":[["rdu",10000],["revenueAuxiliaireContributionsEntretien",200]],"chargesTotales":10460,"revenusTotaux":10200,"montantBourse":260}}],"stats":{"uuid":"59349402- d626 - 439f- 829d- cc63845422cd","loaded":["2017- 02 - 21T10:35:25.038Z","2017- 02 - 21T10:40:56.652Z","2017- 02 - 21T10:41:00.626Z","2017- 02 - 21T10:41:06.836Z","2017- 02 - 21T10:42:51.208Z","2017- 02 - 21T10:42:57.425Z","2017- 02 - 21T10:43:26.401Z","2017- 02 - 21T10:43:32.467Z","2017- 02 - 21T10:43:37.556Z","2017- 02 - 21T10:43:46.812Z","2017- 02 - 21T10:43:51.404Z","2017- 02 - 21T10:44:26.587Z","2017- 02 - 21T10:44:34.095Z","2017- 02 - 21T10:46:55.025Z","2017- 02 - 21T10:46:58.785Z","2017- 02 - 21T10:47:03.299Z","2017- 02 - 21T10:47:21.991Z","2017- 02 - 21T10:47:28.616Z"]},"etudiants":[{"prenom":"John","age":22,"estAdulte":true,"dateNaissance":"1994- 12 - 31T23:00:00.000Z","etatCivil":"C","estEtudiant":true,"niveauEtude":"l3","subsideLamal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331},"$$searchText":"1000 Lausanne","lieuInstitution":{"cas":"","npa":1000,"localite":"Lausanne 25","canton":"VD","region":1,"no":5586,"commune":"Lausanne","district":"DISTRICT DE LAUSANNE","label":"1000 Lausanne"},"aParentLogementAutreFoyer":true,"revenueAuxiliaireContributionsEntretien":200,"nbAdultesFoyer2":1,"nbEnfantsFoyer2":1,"revenuNetFoyer2":12000,"estProprietaireFoyer2":true,"fortuneImmobiliereFoyer2":150000,"bourseEtude":{"charges":[["chargesNormalesBaseFoyer",1960],["chargesNormalesComplementaires",3500],["fraisRepasForfait",1500],["fraisTransportForfait",1000],["fraisEtudeForfait",2500]],"revenus":[["rdu",10000],["revenueAuxiliaireContributionsEntretien",200]],"chargesTotales":10460,"revenusTotaux":10200,"montantBourse":260},"$$hashKey":"object:17"}],"lieuLogement":{"cas":"+ ","npa":1400,"localite":"Cheseaux- Noréaz","canton":"VD","region":2,"no":5909,"commune":"Cheseaux- Noréaz","district":"DISTRICT DU JURA- NORD VAUDOIS","label":"1400 Cheseaux- Noréaz"},"logement":"estLocataire","revenuNetImposable":10000,"subsidesLAMALTotal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331}}');
    const bourses = [];
    for (let i = 0; i < this.sim.etudiants.length; i++) {
      bourses.push(this.bourseEtudeCalcule(calculRDU(this.sim), this.sim.etudiants[i]));
    }
    return bourses;
  }

}

export default CalculeBourse;
