import angular from 'angular';
import 'angular-mocks';
import {tech} from './tech';

describe('tech component', () => {
  beforeEach(() => {
    angular
      .module('fountainTech', ['app/techs/tech.html'])
      .component('fountainTech', tech);
    angular.mock.module('fountainTech');
  });

  it('should render Gulp', angular.mock.inject(($rootScope, $compile) => {
    const $scope = $rootScope.$new();
    $scope.fixture = {
      key: 'gulp',
      title: 'Gulp',
      logo: 'http://fountainjs.io/assets/imgs/gulp.png',
      text1: 'The streaming build system',
      text2: 'Automate and enhance your workflow'
    };
    const element = $compile('<fountain-tech tech="fixture"></fountain-tech>')($scope);
    $scope.$digest();
    const tech = element.find('h3');
    expect(tech.html().trim()).toEqual('Gulp');
  }));
});
