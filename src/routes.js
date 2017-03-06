export default routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      component: 'appMain'
    })
    .state('vous', {
      url: '/vous',
      component: 'baseVous'
    })
    .state('foyer', {
      url: '/foyer',
      component: 'baseFoyer'
    })
    .state('statut', {
      url: '/statut',
      component: 'baseStatut'
    })
    .state('result', {
      url: '/result',
      component: 'baseResult'
    })
    .state('revenu', {
      url: '/revenu',
      component: 'financeRevenu'
    })
    .state('depenses', {
      url: '/depenses',
      component: 'financeDepenses'
    })
    .state('fortune', {
      url: '/fortune',
      component: 'financeFortune'
    })
    .state('bourseEstimation', {
      url: '/bourse/estimation',
      component: 'bourseEstimation'
    })
    .state('bourse', {
      url: '/bourse/:index',
      component: 'bourseEtudiants',
      resolve: {
         /** @ngInject */
        personne: (simulation, $stateParams) => {
          return simulation.etudiants[$stateParams.index];
        }
      }
    })
    .state('bourse.formation', {
      url: '/formation',
      component: 'bourseFormation'
    })
    .state('bourse.revenusAuxiliaires', {
      url: '/revenusAuxiliaires',
      component: 'bourseRevenusAuxiliaires'
    })
    .state('bourse.parents', {
      url: '/parents',
      component: 'bourseParents'
    })
    .state('lamalEstimation', {
      url: '/lamal/estimation',
      component: 'lamalEstimation'
    })
    .state('pcEstimation', {
      url: '/pc/estimation',
      component: 'pcEstimation'
    });
}
