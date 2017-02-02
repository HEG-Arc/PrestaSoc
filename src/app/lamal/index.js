import angular from 'angular';

import {estimation} from './estimation';

export const lamalModule = 'app.lamal';
import {servicesModule} from '../services/index';

angular
  .module(lamalModule, [servicesModule])
  .component('lamalEstimation', estimation);
