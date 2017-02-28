import angular from 'angular';

import {fortune} from './fortune';
import {revenu} from './revenu';
import {depenses} from './depenses';

export const financeModule = 'app.finance';
import {servicesModule} from '../services/index';

angular
  .module(financeModule, [servicesModule])
  .component('financeRevenu', revenu)
  .component('financeFortune', fortune)
  .component('financeDepenses', depenses);
