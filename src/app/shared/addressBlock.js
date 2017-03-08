class AddressBlockController {
  /** @ngInject */
  constructor(simulation, addresses) {
    this.sim = simulation;
    this.addresses = addresses;
  }
  $onChanges() {
  }
}

export const addressBlock = {
  template: require('./addressBlock.html'),
  controller: AddressBlockController,
  bindings: {
    service: '@'
  }
};

