
class NiveauxEtudes {

  /** @ngInject */
  constructor($http) {
    $http.get('app/services/niveauxEtudes.json').then(resp => {
      angular.copy(resp.data, this);
      this._loaded = true;
    });
  }
}

export default NiveauxEtudes;

