import angular from 'angular';
import 'angular-mocks';
import {logement} from './logement';

describe('logement component', () => {
  beforeEach(() => {
    angular
      .module('logement', ['app/base/logement.html'])
      .component('logement', logement);
    angular.mock.module('logement');
  });
});
