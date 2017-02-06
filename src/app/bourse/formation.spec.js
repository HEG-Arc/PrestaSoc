import angular from 'angular';
import 'angular-mocks';
import {formation} from './formation';

describe('formation component', () => {
  beforeEach(() => {
    angular
      .module('formation', ['app/bourse/formation.html'])
      .component('formation', formation);
    angular.mock.module('formation');
  });
});
