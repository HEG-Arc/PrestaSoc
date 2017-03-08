import angular from 'angular';

import {address} from './address';
import {addressBlock} from './addressBlock';

export const sharedModule = 'app.shared';
import {servicesModule} from '../services/index';
import {filtersModule} from '../filters/index';

angular
  .module(sharedModule, [servicesModule, filtersModule])
  .component('appAddress', address)
  .component('appAddressBlock', addressBlock);
