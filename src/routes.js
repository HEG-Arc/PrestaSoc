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
    });
}
