import angular from 'angular';

import {depenses} from './depenses';
import {estimation} from './estimation';

export const pcModule = 'app.pc';
import {servicesModule} from '../services/index';

angular
  .module(pcModule, [servicesModule])
  .component('pcDepenses', depenses)
  .component('pcEstimation', estimation);
