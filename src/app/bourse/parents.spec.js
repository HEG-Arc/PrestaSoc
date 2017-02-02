import angular from 'angular';
import 'angular-mocks';
import {parents} from './parents';

describe('parents component', () => {
  beforeEach(() => {
    angular
      .module('parents', ['app/bourse/parents.html'])
      .component('parents', parents);
    angular.mock.module('parents');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<parents></parents>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
