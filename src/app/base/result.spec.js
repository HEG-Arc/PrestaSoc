import angular from 'angular';
import 'angular-mocks';
import {result} from './result';

describe('result component', () => {
  beforeEach(() => {
    angular
      .module('result', ['app/base/result.html'])
      .component('result', result);
    angular.mock.module('result');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<result></result>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
