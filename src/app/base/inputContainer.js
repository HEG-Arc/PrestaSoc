class InputContainerController {
  /** @ngInject */
  constructor($mdMedia, simulation, vars) {
    this.$mdMedia = $mdMedia;
    this.vars = vars;
    this.sim = simulation;
  }

  $onChanges() {
    if (this.var) {
      const m = this.var.split('.');
      this.model = this.sim;
      if (this.src) {
        this.model = this.src;
      }
      while (m.length > 1) {
        const v = m.shift();
        if (v !== 'personne') {
          this.model = this.model[v];
        }
      }
      this.attribute = m.shift();
    }
  }
}

export const inputContainer = {
  template: require('./inputContainer.html'),
  controller: InputContainerController,
  bindings: {
    var: '@',
    src: '<'
  }
};

