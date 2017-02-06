import angular from 'angular';
import 'angular-mocks';
import Simulation from './simulation';

describe('Simulation service', () => {
  beforeEach(() => {
    angular
      .module('Simulation', [])
      .service('simulation', Simulation);
    angular.mock.module('Simulation');
  });
});
