import angular from 'angular';
import 'angular-mocks';
import {title} from './title';

describe('title component', () => {
  beforeEach(() => {
    angular
      .module('fountainTitle', ['app/title.html'])
      .component('fountainTitle', title);
    angular.mock.module('fountainTitle');
  });

  it('should render \'Allo, \'Allo!', angular.mock.inject(($rootScope, $compile) => {
    const element = $compile('<fountain-title></fountain-title>')($rootScope);
    $rootScope.$digest();
    const title = element.find('h1');
    expect(title.html().trim()).toEqual('\'Allo, \'Allo!');
  }));
});
