import angular from 'angular';

import Simulation from './simulation';
import Variables from './variables';
import Regions from './regions';
import Saver from './saver';

export const servicesModule = 'app.services';

angular
  .module(servicesModule, [])
  .service('simulation', Simulation)
  .service('vars', Variables)
  .service('regions', Regions)
  .service('saver', Saver);
