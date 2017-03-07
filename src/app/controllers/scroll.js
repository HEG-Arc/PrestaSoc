export class ScrollController {
  /** @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  doAutoScroll() {
    return ['main'].indexOf(this.$state.current.name) === -1;
  }
}
