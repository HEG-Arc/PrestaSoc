import angular from 'angular';
import 'angular-mocks';
import {depenses} from './depenses';

describe('depenses component', () => {
  beforeEach(() => {
    angular
      .module('depenses', ['app/pc/depenses.html'])
      .component('depenses', depenses);
    angular.mock.module('depenses');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<depenses></depenses>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
