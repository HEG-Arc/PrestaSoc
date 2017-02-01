import angular from 'angular';
import 'angular-mocks';
import {main} from './main';

describe('main component', () => {
  beforeEach(() => {
    angular
      .module('app', ['app/main.html'])
      .component('appMain', main);
    angular.mock.module('app');
  });

  it('should render the content', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<app-main>Loading...</app-main>')($rootScope);
    $rootScope.$digest();
    expect(element.find('md-content').length).toEqual(1);
  }));
});
