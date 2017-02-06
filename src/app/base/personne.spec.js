import angular from 'angular';
import 'angular-mocks';
import {personne} from './personne';

describe('personne component', () => {
  beforeEach(() => {
    angular
      .module('personne', ['app/base/personne.html'])
      .component('personne', personne);
    angular.mock.module('personne');
  });
});
