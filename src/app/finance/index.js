import angular from 'angular';

import {fortune} from './fortune';
import {revenu} from './revenu';

export const financeModule = 'app.finance';
import {servicesModule} from '../services/index';

angular
  .module(financeModule, [servicesModule])
  .component('financeRevenu', revenu)
  .component('financeFortune', fortune);
