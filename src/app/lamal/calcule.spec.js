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

  it('should provide a subsideLookup', () => {
    // TODO: add test case values
    expect(calculeLamal.subsideLookup(
      'famille',
      false,
      false,
      false,
      20,
      4000,
      1
    )).toEqual({subsideMin: 300, subsideMax: 336, subsideEstime: 330});
  });

  // TODO: other intermediate result test?

  it('shoud compute subsideLamal', () => {
    expect(calculeLamal.subsideLamal({
      // TODO: add test case values
      lieuLogement: {
        region: 1
      },
      personnes: [{
        etatCivil: 'M'
      }]
    })).toEqual({subsideMin: 1, subsideMax: 0, subsideEstime: 0});
  });
});
