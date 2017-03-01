class HelpController {
  /** @ngInject */
  constructor($mdMedia, $timeout, simulation, vars) {
    this.$mdMedia = $mdMedia;
    this.$timeout = $timeout;
    this.vars = vars;
    this.sim = simulation;
    this.showHelp = false;
  }
  showItDelayed() {
    this.timer = this.$timeout(() => {
      this.showHelp = true;
    }, 300);
  }

  cancelHover() {
    this.$timeout.cancel(this.timer);
  }
}

export const help = {
  template: require('./help.html'),
  controller: HelpController,
  bindings: {
    var: '@'
  }
};

