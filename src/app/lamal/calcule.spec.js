import angular from 'angular';
import 'angular-mocks';
import CalculeLamal from './calcule';

describe('CalculeLamal service', () => {
  let calculeLamal;

  beforeEach(() => {
    angular
    .module('CalculeLamal', [])
    .service('calculeLamal', CalculeLamal);
    angular.mock.module('CalculeLamal');
  });
  beforeEach(angular.mock.inject(_calculeLamal_ => {
    calculeLamal = _calculeLamal_;
    // TODO: add test case values
    calculeLamal.subsidesRIPC = [
    ];
    calculeLamal.subsidesRDU = [
    ];
  }));
});
