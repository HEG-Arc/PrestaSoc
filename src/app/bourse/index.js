import angular from 'angular';

import {formation} from './formation';
import {revenusAuxiliaires} from './revenusAuxiliaires';
import {parents} from './parents';
import {estimation} from './estimation';

export const bourseModule = 'app.bourse';
import {servicesModule} from '../services/index';

angular
  .module(bourseModule, [servicesModule])
  .component('bourseFormation', formation)
  .component('bourseRevenusAuxiliaires', revenusAuxiliaires)
  .component('bourseParents', parents)
  .component('bourseEstimation', estimation);
