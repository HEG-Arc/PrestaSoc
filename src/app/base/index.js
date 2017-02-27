import angular from 'angular';

import {vous} from './vous';
import {foyer} from './foyer';
import {logement} from './logement';
import {statut} from './statut';
import {result} from './result';
import {nav} from './nav';
import {personne} from './personne';
import {help} from './help';
import {inputContainer} from './inputContainer';

export const baseModule = 'app.base';
import {servicesModule} from '../services/index';

angular
  .module(baseModule, [servicesModule])
  .component('baseNav', nav)
  .component('baseVous', vous)
  .component('baseFoyer', foyer)
  .component('baseLogement', logement)
  .component('baseStatut', statut)
  .component('baseResult', result)
  .component('basePersonne', personne)
  .component('baseHelp', help)
  .component('baseInputContainer', inputContainer);
