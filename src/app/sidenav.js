class SidenavController {
  /** @ngInject */
  constructor($mdSidenav) {
    this.$mdSidenav = $mdSidenav;
  }

  closeMenu() {
    this.$mdSidenav('left').toggle();
  }

}
export const sidenav = {
  template: require('./sidenav.html'),
  controller: SidenavController
};
