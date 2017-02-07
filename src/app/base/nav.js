class NavController {
  /** @ngInject */
  constructor(saver, $state) {
    this.saver = saver;
    this.$state = $state;
  }

  restart() {
    this.saver.restart();
    this.$state.go('vous');
  }
}

export const nav = {
  template: require('./nav.html'),
  controller: NavController
};

