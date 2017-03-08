import {subsideLamalCalculeVD} from '../calculateur/subsideLamalVD';
import {subsideLamalCalculeNE} from '../calculateur/subsideLamalNE';
import {subsideLamalCalculeGE} from '../calculateur/subsideLamalGE';

class CalculeLamal {

  /** @ngInject */
  constructor($http, $q) {
    this.subsidesVDRDU = [];
    this.subsidesVDRI = [];
    this.subsidesVDPC = [];
    this.subsidesNEClasses = [];
    this.subsidesNERDU = [];
    this.subsidesNEASPC = [];
    this.subsidesGERDU = [];
    this.$q = $q;
    const deferred = $q.defer();

    $q.all([
      $http.get('app/lamal/lamalVDSubsidesRDU.json').then(resp => {
        this.subsidesVDRDU = resp.data;
      }),
      $http.get('app/lamal/lamalVDSubsidesRI.json').then(resp => {
        this.subsidesVDRI = resp.data;
      }),
      $http.get('app/lamal/lamalVDSubsidesPC.json').then(resp => {
        this.subsidesVDPC = resp.data;
      }),
      $http.get('app/lamal/lamalNEClasses.json').then(resp => {
        this.subsidesNEClasses = resp.data;
      }),
      $http.get('app/lamal/lamalNESubsidesRDU.json').then(resp => {
        this.subsidesNERDU = resp.data;
      }),
      $http.get('app/lamal/lamalNESubsidesASPC.json').then(resp => {
        this.subsidesNEASPC = resp.data;
      }),
      $http.get('app/lamal/lamalGESubsidesRDU.json').then(resp => {
        this.subsidesGERDU = resp.data;
      })
    ]).then(() => {
      deferred.resolve(true);
    });
    this.ready = deferred.promise;
  }

  subsideLamal(sim) {
    // TODO: make state less by passing sim arround?
    this.sim = sim;
    // TODO: only load right canton? #11
    return this.ready.then(() => {
      if (this.sim.lieuLogement.canton === 'VD') {
        return subsideLamalCalculeVD(sim, this.subsidesVDRDU, this.subsidesVDRI, this.subsidesVDPC);
      }
      if (this.sim.lieuLogement.canton === 'NE') {
        return subsideLamalCalculeNE(sim, this.subsidesNEClasses, this.subsidesNERDU, this.subsidesNEASPC);
      }
      if (this.sim.lieuLogement.canton === 'GE') {
        return subsideLamalCalculeGE(sim, this.subsidesGERDU);
      }
      throw new Error('Canton not supported');
    });
  }

}

export default CalculeLamal;
