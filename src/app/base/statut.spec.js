import angular from 'angular';
import 'angular-mocks';
import {statut} from './statut';

describe('statut component', () => {
  beforeEach(() => {
    angular
      .module('statut', ['app/base/statut.html'])
      .component('statut', statut);
    angular.mock.module('statut');
  });
});
