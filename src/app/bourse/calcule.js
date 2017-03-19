import {bourseEtudeVD} from '../calculateur/bourseCalculVD';
import {bourseEtudeNE} from '../calculateur/bourseCalculNE';
import {bourseEtudeGE} from '../calculateur/bourseCalculGE';

// REF http://www.guidesocial.ch/fr/fiche/960/
class CalculeBourse {

  /** @ngInject */
  constructor($http, $q) {
    this.chargesNormalesBaseVD = [];
    this.fraisEtudeVD = [];
    this.chargesNormalesIndependantVD = [];
    this.fraisTransportVD = [];
    this.chargesNormalesComplementairesVD = [];
    this.bourseZonesVD = [];
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
      }),
      $http.get('app/bourse/bourseZonesVD.json').then(resp => {
        this.bourseZonesVD = resp.data;
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
        sim.boursesTotales = bourseEtudeVD(sim, this.chargesNormalesBaseVD, this.fraisEtudeVD, this.chargesNormalesIndependantVD, this.fraisTransportVD, this.chargesNormalesComplementairesVD, this.bourseZonesVD);
        return sim.boursesTotales;
      }
      if (this.sim.lieuLogement.canton === 'NE') {
        sim.boursesTotales = bourseEtudeNE(sim);
        return sim.boursesTotales;
      }
      if (this.sim.lieuLogement.canton === 'GE') {
        sim.bourses = bourseEtudeGE(sim);
        sim.boursesTotales = sim.bourses.boursesTotales;
        return sim.boursesTotales;
      }
      throw new Error('Canton not supported');
    });
  }
}

export default CalculeBourse;
