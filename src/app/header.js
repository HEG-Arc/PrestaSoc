class HeaderController {
  /** @ngInject */
  constructor($mdSidenav) {
    this.$mdSidenav = $mdSidenav;
  }

  openMenu() {
    this.$mdSidenav('left').toggle();
  }

}
export const header = {
  template: require('./header.html'),
  controller: HeaderController
};
