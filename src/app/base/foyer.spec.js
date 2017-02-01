import angular from 'angular';
import 'angular-mocks';
import {foyer} from './foyer';

describe('foyer component', () => {
  beforeEach(() => {
    angular
      .module('foyer', ['app/base/foyer.html'])
      .component('foyer', foyer);
    angular.mock.module('foyer');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<foyer></foyer>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
