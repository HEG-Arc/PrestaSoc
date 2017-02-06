import angular from 'angular';
import 'angular-mocks';
import {vous} from './vous';

describe('vous component', () => {
  beforeEach(() => {
    angular
      .module('vous', ['app/base/vous.html'])
      .component('vous', vous);
    angular.mock.module('vous');
  });
});
