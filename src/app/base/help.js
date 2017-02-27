class HelpController {
  /** @ngInject */
  constructor($mdMedia, simulation, vars) {
    this.$mdMedia = $mdMedia;
    this.vars = vars;
    this.sim = simulation;
    this.showHelp = false;
  }
}

export const help = {
  template: require('./help.html'),
  controller: HelpController,
  bindings: {
    var: '@'
  }
};

