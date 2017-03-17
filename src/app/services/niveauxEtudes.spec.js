import angular from 'angular';
import 'angular-mocks';
import NiveauxEtudes from './niveauxEtudes';

describe('NiveauxEtudes service', () => {
  beforeEach(() => {
    angular
      .module('NiveauxEtudes', [])
      .service('NiveauxEtudes', NiveauxEtudes);
    angular.mock.module('NiveauxEtudes');
  });
});
