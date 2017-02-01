import angular from 'angular';

import Simulation from './simulation';

export const servicesModule = 'app.services';

angular
  .module(servicesModule, [])
  .service('simulation', Simulation);
