import angular from 'angular';
import 'angular-mocks';
import Addresses from './addresses';

const TEST_DATA = [
  {canton: 'all', communes: [-1], prestations: ['all']},
  {canton: 'all', communes: [-1], prestations: ['pc']},
  {canton: 'all', communes: [-1], prestations: ['lamal']},
  {canton: 'all', communes: [1234], prestations: ['all']},
  {canton: 'all', communes: [4321], prestations: ['all']},
  {canton: 'NE', communes: [-1], prestations: ['all']},
  {canton: 'VD', communes: [-1], prestations: ['all']},
  {canton: 'all', communes: [1234], prestations: ['pc']},
  {canton: 'all', communes: [4321], prestations: ['pc']},
  {canton: 'all', communes: [4321], prestations: ['lamal']},
  {canton: 'NE', communes: [1234], prestations: ['pc']},
  {canton: 'VD', communes: [1234], prestations: ['pc']},
  {canton: 'VD', communes: [1234], prestations: ['lamal']},
  {canton: 'NE', communes: [1234], prestations: ['all']},
  {canton: 'NE', communes: [4321], prestations: ['all']},
  {canton: 'VD', communes: [1234], prestations: ['all']},
  {canton: 'NE', communes: [-1], prestations: ['pc']},
  {canton: 'NE', communes: [-1], prestations: ['lamal']},
  {canton: 'VD', communes: [-1], prestations: ['lamal']}
];

describe('Addresses service', () => {
  let $httpBackend;
  let addresses;

  beforeEach(() => {
    angular
    .module('Addresses', [])
    .service('addresses', Addresses);
    angular.mock.module('Addresses');

    angular.mock.inject((_addresses_, _$httpBackend_) => {
      addresses = _addresses_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', () => true)
                  .respond(TEST_DATA);
    });
  });

  it('should findAll data', () => {
    $httpBackend.flush();
    expect(addresses.findAll().length).toEqual(TEST_DATA.length);
  });

  it('should findByCanton excluding all', () => {
    $httpBackend.flush();
    expect(addresses.findByCanton('NE')).toEqual([
      {canton: 'NE', communes: [-1], prestations: ['all']},
      {canton: 'NE', communes: [1234], prestations: ['pc']},
      {canton: 'NE', communes: [1234], prestations: ['all']},
      {canton: 'NE', communes: [4321], prestations: ['all']},
      {canton: 'NE', communes: [-1], prestations: ['pc']},
      {canton: 'NE', communes: [-1], prestations: ['lamal']}
    ]);
  });

  it('should findByCantonAndcommunesAndService including all', () => {
    $httpBackend.flush();
    expect(addresses.findByCantonAndCommuneAndService('VD', 1234, 'lamal')).toEqual([
      {canton: 'all', communes: [-1], prestations: ['all']},
      {canton: 'all', communes: [-1], prestations: ['lamal']},
      {canton: 'all', communes: [1234], prestations: ['all']},
      {canton: 'VD', communes: [-1], prestations: ['all']},
      {canton: 'VD', communes: [1234], prestations: ['lamal']},
      {canton: 'VD', communes: [1234], prestations: ['all']},
      {canton: 'VD', communes: [-1], prestations: ['lamal']}
    ]);
  });

  it('should findByCantonAndcommunesAndService including all', () => {
    $httpBackend.flush();
    expect(addresses.findByCantonAndCommuneAndService('NE', 1234, 'pc')).toEqual([
      {canton: 'all', communes: [-1], prestations: ['all']},
      {canton: 'all', communes: [-1], prestations: ['pc']},
      {canton: 'all', communes: [1234], prestations: ['all']},
      {canton: 'NE', communes: [-1], prestations: ['all']},
      {canton: 'all', communes: [1234], prestations: ['pc']},
      {canton: 'NE', communes: [1234], prestations: ['pc']},
      {canton: 'NE', communes: [1234], prestations: ['all']},
      {canton: 'NE', communes: [-1], prestations: ['pc']}
    ]);
  });
});
