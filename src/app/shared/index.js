import angular from 'angular';

import {address} from './address';

export const sharedModule = 'app.shared';
import {servicesModule} from '../services/index';
import {filtersModule} from '../filters/index';

angular
  .module(sharedModule, [servicesModule, filtersModule])
  .component('appAddress', address);
