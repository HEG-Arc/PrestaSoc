import angular from 'angular';
import 'angular-mocks';
import {etudiants} from './etudiants';

describe('etudiant component', () => {
  beforeEach(() => {
    angular
      .module('etudiant', ['app/bourse/etudiant.html'])
      .component('etudiant', etudiants);
    angular.mock.module('etudiant');
  });
});
