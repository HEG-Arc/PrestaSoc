class PersonneController {
  /** @ngInject */
  constructor($scope, simulation, niveauxEtudes) {
    this.niveauxEtudes = niveauxEtudes;

    $scope.$watch('$ctrl.personne.age', () => {
      this.personne.estAdulte = this.personne.age >= 18;
      // TODO: cleanup toggled variables?
    });
    $scope.$watch('$ctrl.personne.estEtudiant', () => {
      simulation.updateEtudiants();
    });
    $scope.$watch('$ctrl.personne.estBeneficiaireRien', () => {
      if (this.personne.estBeneficiaireRien) {
        this.personne.estBeneficiaireAVS = false;
        this.personne.estBeneficiaireAI = false;
        this.personne.estBeneficiairePC = false;
        this.personne.estBeneficiaireRI = false;
        this.personne.estBeneficiaireAutre = false;
      }
    });

    $scope.$watch('[$ctrl.personne.estBeneficiaireAVS, $ctrl.personne.estBeneficiaireAI, $ctrl.personne.estBeneficiairePC, $ctrl.personne.estBeneficiaireRI, $ctrl.personne.estBeneficiaireAutre]', () => {
      if (this.personne.estBeneficiaireAVS ||
        this.personne.estBeneficiaireAI ||
        this.personne.estBeneficiairePC ||
        this.personne.estBeneficiaireRI ||
        this.personne.estBeneficiaireAutre) {
        this.personne.estBeneficiaireRien = false;
      }
    }, true);
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

