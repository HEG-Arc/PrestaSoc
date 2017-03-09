import angular from 'angular';
import 'angular-mocks';
import {estimation} from './estimation';

describe('bourse estimation component', () => {
  beforeEach(() => {
    angular
      .module('estimation', ['app/bourse/estimation.html'])
      .component('estimation', estimation)
      .service('simulation', () => {})
      .factory('bourseCalcule', () => {
        return {
          bourseEtude: () => 123
        };
      });
    angular.mock.module('estimation');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<estimation></estimation>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
