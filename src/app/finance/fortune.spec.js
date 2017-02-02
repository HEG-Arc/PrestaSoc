import angular from 'angular';
import 'angular-mocks';
import {fortune} from './fortune';

describe('fortune component', () => {
  beforeEach(() => {
    angular
      .module('fortune', ['app/finance/fortune.html'])
      .component('fortune', fortune);
    angular.mock.module('fortune');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<fortune></fortune>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
