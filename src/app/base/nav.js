class NavController {
  /** @ngInject */
  constructor(saver, $state) {
    this.saver = saver;
    this.$state = $state;
  }

  isBase() {
    return this.$state.is('vous') || this.$state.is('foyer') || this.$state.is('logement');
  }

  isFinance() {
    return this.$state.is('revenu') || this.$state.is('fortune');
  }

  isLamal() {
    return this.$state.is('lamalEstimation');
  }

  isPC() {
    return this.$state.is('pcDepenses') || this.$state.is('pcEstimation');
  }

  isBourse() {
    return this.$state.includes('bourse') || this.$state.is('bourseEstimation');
  }

  restart() {
    this.saver.restart();
    this.$state.go('vous', null, {reload: true});
  }
}

export const nav = {
  template: require('./nav.html'),
  controller: NavController
};

