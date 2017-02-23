import {subsideLamalCalculeVD} from '../calculateur/subsideLamalVD';

class CalculeLamal {

  /** @ngInject */
  constructor($http, $q) {
    this.subsidesRDU = {};
    this.subsidesRIPC = {};
    this.$q = $q;
    const deferred = $q.defer();

    $q.all([
      $http.get('app/lamal/lamalVDSubsidesRDU.json').then(resp => {
        this.subsidesRDU = resp.data;
      }),
      $http.get('app/lamal/lamalVDSubsidesRIPC.json').then(resp => {
        this.subsidesRIPC = resp.data;
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
        return subsideLamalCalculeVD(sim);
      }
      if (this.sim.lieuLogement.canton === 'NE') {
        return {subsideMin: -1, subsideMax: -1, subsideEstime: -1};
      }
      if (this.sim.lieuLogement.canton === 'GE') {
        return {subsideMin: -1, subsideMax: -1, subsideEstime: -1};
      }
      throw new Error('Canton not supported');
    });
  }

}

export default CalculeLamal;
