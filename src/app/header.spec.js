import angular from 'angular';
import 'angular-mocks';
import {header} from './header';

describe('header component', () => {
  beforeEach(() => {
    angular
      .module('appHeader', ['app/header.html'])
      .component('appHeader', header)
      .service('$mdSidenav', () => {});
    angular.mock.module('appHeader');
  });

  it('should render title', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<app-header></app-header>')($rootScope);
    $rootScope.$digest();
    const header = element.find('a');
    expect(header.html().trim()).toEqual('jestime.ch');
  }));
});
