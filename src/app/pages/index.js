import angular from 'angular';

import {about} from './about';
import {addresses} from './addresses';

export const pagesModule = 'app.pages';
import {servicesModule} from '../services/index';

angular
  .module(pagesModule, [servicesModule])
  .component('pageAbout', about)
  .component('pageAddresses', addresses);
