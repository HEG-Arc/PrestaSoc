import angular from 'angular';
import 'angular-mocks';
import {revenu} from './revenu';

describe('revenu component', () => {
  beforeEach(() => {
    angular
      .module('revenu', ['app/finance/revenu.html'])
      .component('revenu', revenu);
    angular.mock.module('revenu');
  });
});
