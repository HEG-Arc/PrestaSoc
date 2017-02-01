import angular from 'angular';
import 'angular-mocks';
import {logement} from './logement';

describe('logement component', () => {
  beforeEach(() => {
    angular
      .module('logement', ['app/base/logement.html'])
      .component('logement', logement);
    angular.mock.module('logement');
  });

  it('should...', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<logement></logement>')($rootScope);
    $rootScope.$digest();
    expect(element).not.toBeNull();
  }));
});
