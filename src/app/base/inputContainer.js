class InputContainerController {
  /** @ngInject */
  constructor($mdMedia, simulation, vars) {
    this.$mdMedia = $mdMedia;
    this.vars = vars;
    this.sim = simulation;
  }
}

export const inputContainer = {
  template: require('./inputContainer.html'),
  controller: InputContainerController,
  bindings: {
    var: '@'
  }
};

