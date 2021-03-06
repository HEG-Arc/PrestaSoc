import angular from 'angular';

import {etudiants} from './etudiants';
import {formation} from './formation';
import {revenusAuxiliaires} from './revenusAuxiliaires';
import {parents} from './parents';
import {estimation} from './estimation';
import CalculeBourse from './calcule';

export const bourseModule = 'app.bourse';
import {servicesModule} from '../services/index';

angular
  .module(bourseModule, [servicesModule])
  .component('bourseFormation', formation)
  .component('bourseRevenusAuxiliaires', revenusAuxiliaires)
  .component('bourseParents', parents)
  .component('bourseEstimation', estimation)
  .component('bourseEtudiants', etudiants)
  .service('bourseCalcule', CalculeBourse);

