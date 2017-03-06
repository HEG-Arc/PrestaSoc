class MainController {
  /** @ngInject */
  constructor(simulation, saver, $state) {
    this.sim = simulation;
    this.saver = saver;
    this.$state = $state;
  }

  canContinue() {
    return this.saver.loadedState && this.sim.stats.loaded.length > 1;
  }

  continue() {
    if (this.canContinue()) {
      if (this.saver.loadedState.state.name === 'main') {
        this.saver.loadedState.state.name = 'vous';
      }
      this.$state.go(this.saver.loadedState.state.name, this.saver.loadedState.params);
    }
  }

  restart() {
    this.saver.restart();
    this.$state.go('vous', null, {reload: true});
  }
}

export const main = {
  template: require('./main.html'),
  controller: MainController
};
