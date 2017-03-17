import angular from 'angular';

import Simulation from './simulation';
import Variables from './variables';
import Addresses from './addresses';
import Regions from './regions';
import NiveauxEtudes from './niveauxEtudes';
import Saver from './saver';

export const servicesModule = 'app.services';

angular
  .module(servicesModule, [])
  .service('simulation', Simulation)
  .service('vars', Variables)
  .service('addresses', Addresses)
  .service('regions', Regions)
  .service('niveauxEtudes', NiveauxEtudes)
  .service('saver', Saver);
