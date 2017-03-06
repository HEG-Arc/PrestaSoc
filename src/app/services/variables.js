class Variables {
  /** @ngInject */
  constructor($http) {
    $http.get('https://script.google.com/macros/s/AKfycbxxtYoEsXArEobqe3Egs5-kWHawM45IggQYLczhUbcELDYg7Ag/exec').then(resp => {
      angular.copy(resp.data, this);
      this._loaded = true;
    });
  }
}

export default Variables;

