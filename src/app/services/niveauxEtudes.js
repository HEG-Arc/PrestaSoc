
class NiveauxEtudes {

  /** @ngInject */
  constructor($http) {
    this.data = [];
    $http.get('app/services/niveauxEtudes.json').then(resp => {
      angular.copy(resp.data, this.data);
      this._loaded = true;
    });
  }
}

export default NiveauxEtudes;

