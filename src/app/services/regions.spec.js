import angular from 'angular';
import 'angular-mocks';
import Regions from './regions';

describe('Regions service', () => {
  beforeEach(() => {
    angular
      .module('Regions', [])
      .service('Regions', Regions);
    angular.mock.module('Regions');
  });
});
