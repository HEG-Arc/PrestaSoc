import angular from 'angular';

import {nl2br} from './nl2br';
import {domain} from './domain';

export const filtersModule = 'app.filters';

angular
  .module(filtersModule, [])
  .filter('nl2br', nl2br)
  .filter('domain', domain);

