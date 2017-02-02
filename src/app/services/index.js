import angular from 'angular';

import Simulation from './simulation';
import Regions from './regions';

export const servicesModule = 'app.services';

angular
  .module(servicesModule, [])
  .service('simulation', Simulation)
  .service('regions', Regions);
