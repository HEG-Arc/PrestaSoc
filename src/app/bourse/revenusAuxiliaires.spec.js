import angular from 'angular';
import 'angular-mocks';
import {revenusAuxiliaires} from './revenusAuxiliaires';

describe('revenusAuxiliaires component', () => {
  beforeEach(() => {
    angular
      .module('revenusAuxiliaires', ['app/bourse/revenusAuxiliaires.html'])
      .component('revenusAuxiliaires', revenusAuxiliaires);
    angular.mock.module('revenusAuxiliaires');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<revenusAuxiliaires></revenusAuxiliaires>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
