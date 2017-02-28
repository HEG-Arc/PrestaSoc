import angular from 'angular';

import {estimation} from './estimation';
import CalculePC from './calcule';

export const pcModule = 'app.pc';
import {servicesModule} from '../services/index';

angular
  .module(pcModule, [servicesModule])
  .component('pcEstimation', estimation)
  .service('pcCalcule', CalculePC);

