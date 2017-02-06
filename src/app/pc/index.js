import angular from 'angular';

import {depenses} from './depenses';
import {estimation} from './estimation';
import CalculePC from './calcule';

export const pcModule = 'app.pc';
import {servicesModule} from '../services/index';

angular
  .module(pcModule, [servicesModule])
  .component('pcDepenses', depenses)
  .component('pcEstimation', estimation)
  .service('pcCalcule', CalculePC);

