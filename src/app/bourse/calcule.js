import {calculRDU} from '../calculateur/calculRDUVD';
import {bourseEtudeVD} from '../calculateur/bourseCalculVD';

// REF http://www.guidesocial.ch/fr/fiche/960/
class CalculeBourse {

  /** @ngInject */
  constructor($http, $q) {
    this.chargesNormalesBaseVD = [];
    this.fraisEtudeVD = [];
    this.chargesNormalesIndependantVD = [];
    this.fraisTransportVD = [];
    this.chargesNormalesComplementairesVD = [];
    this.$q = $q;
    const deferred = $q.defer();

    $q.all([
      $http.get('app/bourse/chargesNormalesBaseVD.json').then(resp => {
        this.chargesNormalesBaseVD = resp.data;
      }),
      $http.get('app/bourse/fraisEtudeVD.json').then(resp => {
        this.fraisEtudeVD = resp.data;
      }),
      $http.get('app/bourse/chargesNormalesComplementairesVD.json').then(resp => {
        this.chargesNormalesComplementairesVD = resp.data;
      }),
      $http.get('app/bourse/chargesNormalesIndependantVD.json').then(resp => {
        this.chargesNormalesIndependantVD = resp.data;
      }),
      $http.get('app/bourse/fraisTransportVD.json').then(resp => {
        this.fraisTransportVD = resp.data;
      })
    ]).then(() => {
      deferred.resolve(true);
    });
    this.ready = deferred.promise;
  }

  bourseEtude(sim) {
    this.sim = sim;
    return this.ready.then(() => {
      if (this.sim.lieuLogement.canton === 'VD') {
        return bourseEtudeVD(sim, this.chargesNormalesBaseVD, this.fraisEtudeVD, this.chargesNormalesIndependantVD, this.fraisTransportVD, this.chargesNormalesComplementairesVD);
      }
      throw new Error('Canton not supported');
    });
  }

  bourseEtudeTest() {
    this.sim = angular.fromJson('{"personnes":[{"prenom":"John","age":22,"estAdulte":true,"dateNaissance":"1994- 12 - 31T23:00:00.000Z","etatCivil":"C","estEtudiant":true,"niveauEtude":"l3","subsideLamal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331},"$$searchText":"1000 Lausanne","lieuInstitution":{"cas":"","npa":1000,"localite":"Lausanne 25","canton":"VD","region":1,"no":5586,"commune":"Lausanne","district":"DISTRICT DE LAUSANNE","label":"1000 Lausanne"},"aParentLogementAutreFoyer":true,"revenueAuxiliaireContributionsEntretien":200,"nbAdultesFoyer2":1,"nbEnfantsFoyer2":1,"revenuNetFoyer2":12000,"estProprietaireFoyer2":true,"fortuneImmobiliereFoyer2":150000,"bourseEtude":{"charges":[["chargesNormalesBaseFoyer",1960],["chargesNormalesComplementairesVD",3500],["fraisRepasForfait",1500],["fraisTransportForfait",1000],["fraisEtudeVDForfait",2500]],"revenus":[["rdu",10000],["revenueAuxiliaireContributionsEntretien",200]],"chargesTotales":10460,"revenusTotaux":10200,"montantBourse":260}}],"stats":{"uuid":"59349402- d626 - 439f- 829d- cc63845422cd","loaded":["2017- 02 - 21T10:35:25.038Z","2017- 02 - 21T10:40:56.652Z","2017- 02 - 21T10:41:00.626Z","2017- 02 - 21T10:41:06.836Z","2017- 02 - 21T10:42:51.208Z","2017- 02 - 21T10:42:57.425Z","2017- 02 - 21T10:43:26.401Z","2017- 02 - 21T10:43:32.467Z","2017- 02 - 21T10:43:37.556Z","2017- 02 - 21T10:43:46.812Z","2017- 02 - 21T10:43:51.404Z","2017- 02 - 21T10:44:26.587Z","2017- 02 - 21T10:44:34.095Z","2017- 02 - 21T10:46:55.025Z","2017- 02 - 21T10:46:58.785Z","2017- 02 - 21T10:47:03.299Z","2017- 02 - 21T10:47:21.991Z","2017- 02 - 21T10:47:28.616Z"]},"etudiants":[{"prenom":"John","age":22,"estAdulte":true,"dateNaissance":"1994- 12 - 31T23:00:00.000Z","etatCivil":"C","estEtudiant":true,"niveauEtude":"l3","subsideLamal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331},"$$searchText":"1000 Lausanne","lieuInstitution":{"cas":"","npa":1000,"localite":"Lausanne 25","canton":"VD","region":1,"no":5586,"commune":"Lausanne","district":"DISTRICT DE LAUSANNE","label":"1000 Lausanne"},"aParentLogementAutreFoyer":true,"revenueAuxiliaireContributionsEntretien":200,"nbAdultesFoyer2":1,"nbEnfantsFoyer2":1,"revenuNetFoyer2":12000,"estProprietaireFoyer2":true,"fortuneImmobiliereFoyer2":150000,"bourseEtude":{"charges":[["chargesNormalesBaseFoyer",1960],["chargesNormalesComplementairesVD",3500],["fraisRepasForfait",1500],["fraisTransportForfait",1000],["fraisEtudeVDForfait",2500]],"revenus":[["rdu",10000],["revenueAuxiliaireContributionsEntretien",200]],"chargesTotales":10460,"revenusTotaux":10200,"montantBourse":260},"$$hashKey":"object:17"}],"lieuLogement":{"cas":"+ ","npa":1400,"localite":"Cheseaux- Noréaz","canton":"VD","region":2,"no":5909,"commune":"Cheseaux- Noréaz","district":"DISTRICT DU JURA- NORD VAUDOIS","label":"1400 Cheseaux- Noréaz"},"logement":"estLocataire","revenuNetImposable":10000,"subsidesLAMALTotal":{"subsideMin":331,"subsideMax":331,"subsideEstime":331}}');
    const bourses = [];
    for (let i = 0; i < this.sim.etudiants.length; i++) {
      bourses.push(this.bourseEtudeCalcule(calculRDU(this.sim), this.sim.etudiants[i]));
    }
    return bourses;
  }

}

export default CalculeBourse;
