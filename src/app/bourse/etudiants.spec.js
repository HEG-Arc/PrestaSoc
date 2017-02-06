import angular from 'angular';
import 'angular-mocks';
import {etudiant} from './etudiant';

describe('etudiant component', () => {
  beforeEach(() => {
    angular
      .module('etudiant', ['app/bourse/etudiant.html'])
      .component('etudiant', etudiant);
    angular.mock.module('etudiant');
  });
});
