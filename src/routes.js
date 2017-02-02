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
    .state('logement', {
      url: '/logement',
      component: 'baseLogement'
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
    .state('fortune', {
      url: '/fortune',
      component: 'financeFortune'
    })
    .state('formation', {
      url: '/formation',
      component: 'bourseFormation'
    })
    .state('revenusAuxiliaires', {
      url: '/revenusAuxiliaires',
      component: 'bourseRevenusAuxiliaires'
    })
    .state('parents', {
      url: '/parents',
      component: 'bourseParents'
    })
    .state('bourseEstimation', {
      url: '/bourseEstimation',
      component: 'bourseEstimation'
    })
    .state('lamalEstimation', {
      url: '/lamalEstimation',
      component: 'lamalEstimation'
    })
    .state('pcDepenses', {
      url: '/pcDepenses',
      component: 'pcDepenses'
    })
    .state('pcEstimation', {
      url: '/pcEstimation',
      component: 'pcEstimation'
    });
}
