class AddressController {
  $onChanges() {
  }
}

export const address = {
  template: require('./address.html'),
  controller: AddressController,
  bindings: {
    address: '<'
  }
};

