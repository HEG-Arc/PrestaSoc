class PersonneController {
  /** @ngInject */
  constructor($scope, simulation) {
    $scope.$watch('$ctrl.personne.age', () => {
      this.personne.estAdulte = this.personne.age >= 18;
      // TODO: cleanup toggled variables?
    });
    $scope.$watch('$ctrl.personne.estEtudiant', () => {
      simulation.updateEtudiants();
    });
  }

  calculateAge(birthDate) {
    if (!birthDate) {
      return 0;
    }
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    const birthYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth();
    const birthDay = birthDate.getDate();
    let age = todayYear - birthYear;
    if (todayMonth < birthMonth - 1) {
      age--;
    }

    if (birthMonth - 1 === todayMonth && todayDay < birthDay) {
      age--;
    }

    return age;
  }
}

export const personne = {
  template: require('./personne.html'),
  bindings: {
    personne: '<'
  },
  controller: PersonneController
};

