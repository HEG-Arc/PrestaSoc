class DepensesController {
  /** @ngInject */
  constructor($scope, simulation) {
    this.sim = simulation;
    $scope.$watch('$ctrl.sim.logementLoyerBrutMensuel', () => {
      if (angular.isDefined(simulation.logementLoyerBrutMensuel)) {
        simulation.logementLoyerBrut = simulation.logementLoyerBrutMensuel * 12;
      }
    });
  }
}

export const depenses = {
  template: require('./depenses.html'),
  controller: DepensesController
};

