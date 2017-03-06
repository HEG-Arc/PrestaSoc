class CheckboxController {
  /** @ngInject */
  constructor($mdMedia, simulation, vars) {
    this.$mdMedia = $mdMedia;
    this.vars = vars;
    this.sim = simulation;
    this.showHelp = false;
  }

  $onChanges() {
    if (this.var) {
      const m = this.var.split('.');
      this.model = this.sim;
      if (this.src) {
        this.model = this.src;
      }
      while (m.length > 1) {
        this.model = this.model[m.shift()];
      }
      this.attribute = m.shift();
    }
  }
}

export const checkbox = {
  template: require('./checkbox.html'),
  controller: CheckboxController,
  bindings: {
    var: '@',
    src: '<'
  }
};

