import angular from 'angular';
import 'angular-mocks';
import Saver from './saver';

describe('Saver service', () => {
  beforeEach(() => {
    angular
      .module('Saver', [])
      .service('Saver', Saver);
    angular.mock.module('Saver');
  });
});
