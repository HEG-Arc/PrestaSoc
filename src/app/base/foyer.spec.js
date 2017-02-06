import angular from 'angular';
import 'angular-mocks';
import {foyer} from './foyer';

describe('foyer component', () => {
  beforeEach(() => {
    angular
      .module('foyer', ['app/base/foyer.html'])
      .component('foyer', foyer);
    angular.mock.module('foyer');
  });
});
