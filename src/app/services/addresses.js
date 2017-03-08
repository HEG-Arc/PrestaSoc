class Addresses {
  /** @ngInject */
  constructor($http) {
    this._data = [];
    $http.get('https://script.google.com/macros/s/AKfycbztztCESd8OYsmpPWsgiiRSqar3IxplrwhEtaVkdEE08Q_wxKs/exec').then(resp => {
      this._data = resp.data;
      this._loaded = true;
    });
  }

  findByCantonAndCommuneAndService(canton, commune, prestation) {
    return this._data.reduce((result, address) => {
      if (address.canton === canton || address.canton === 'all') {
        if (address.communes.indexOf(commune) > -1) {
          if (address.prestations.indexOf(prestation) > -1 || address.prestations.indexOf('all') === 0) {
            result.push(address);
          }
        }
      }
      return result;
    }, []);
  }

  findByCanton(canton) {
    return this._data.filter(address => {
      return address.canton === canton;
    });
  }

  findAll() {
    return this._data;
  }

}

export default Addresses;

