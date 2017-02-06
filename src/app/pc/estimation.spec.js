import angular from 'angular';
import 'angular-mocks';
import {estimation} from './estimation';

describe('estimation component', () => {
  beforeEach(() => {
    angular
      .module('estimation', ['app/pc/estimation.html'])
      .component('estimation', estimation);
    angular.mock.module('estimation');
  });
});
