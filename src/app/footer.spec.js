import angular from 'angular';
import 'angular-mocks';
import {footer} from './footer';

describe('footer component', () => {
  beforeEach(() => {
    angular
      .module('appFooter', ['app/footer.html'])
      .component('appFooter', footer);
    angular.mock.module('appFooter');
  });

  it('should render \'heg-arc\'', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<app-footer></app-footer>')($rootScope);
    $rootScope.$digest();
    const footer = element.find('a');
    expect(footer.html().trim()).toEqual('heg-arc');
  }));
});
