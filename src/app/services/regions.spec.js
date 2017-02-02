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

  it('should', angular.mock.inject(Regions => {
    expect(Regions.getData()).toEqual(3);
  }));
});
