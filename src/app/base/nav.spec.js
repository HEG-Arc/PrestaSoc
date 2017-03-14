import angular from 'angular';
import 'angular-mocks';
import {nav} from './nav';

describe('nav component', () => {
  beforeEach(() => {
    angular
      .module('nav', ['app/base/nav.html'])
      .component('nav', nav)
      .service('$stateParams', () => {})
      .service('saver', () => {})
      .factory('$state', () => {
        return {
          is: () => true,
          includes: () => true
        };
      });
    angular.mock.module('nav');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<nav></nav>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
