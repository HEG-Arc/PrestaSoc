import angular from 'angular';

import {vous} from './vous';
import {foyer} from './foyer';
import {logement} from './logement';
import {statut} from './statut';
import {nav} from './nav';

export const baseModule = 'app.base';
import {servicesModule} from '../services/index';

angular
  .module(baseModule, [servicesModule])
  .component('baseVous', vous)
  .component('baseFoyer', foyer)
  .component('baseLogement', logement)
  .component('baseStatut', statut)
  .component('baseNav', nav);
