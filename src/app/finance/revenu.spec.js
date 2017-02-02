import angular from 'angular';
import 'angular-mocks';
import {revenu} from './revenu';

describe('revenu component', () => {
  beforeEach(() => {
    angular
      .module('revenu', ['app/finance/revenu.html'])
      .component('revenu', revenu);
    angular.mock.module('revenu');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<revenu></revenu>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
