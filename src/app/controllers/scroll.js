const AUTO_SCROLL_OFF_STATES = ['main', 'about', 'addresses'];

export class ScrollController {
  /** @ngInject */
  constructor($state) {
    this.$state = $state;
  }

  doAutoScroll() {
    return AUTO_SCROLL_OFF_STATES.indexOf(this.$state.current.name) === -1;
  }
}
