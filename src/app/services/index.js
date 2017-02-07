import angular from 'angular';

import Simulation from './simulation';
import Regions from './regions';
import Saver from './saver';

export const servicesModule = 'app.services';

angular
  .module(servicesModule, [])
  .service('simulation', Simulation)
  .service('regions', Regions)
  .service('saver', Saver);
