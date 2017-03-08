class AddressesController {
  /** @ngInject */
  constructor(addresses) {
    this.addresses = addresses;
  }
}

export const addresses = {
  template: require('./addresses.html'),
  controller: AddressesController
};

