import angular from 'angular';
import 'angular-i18n/fr-ch';

// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';
// polyfill for $stateChangeSuccess
require('angular-ui-router/release/stateEvents');

import angularGoogleAnalytics from 'angular-google-analytics';

import Raven from 'raven-js';
Raven
  .config('https://d903cc3f813240a080d8dbe8f59583ff@sentry.ga-fl.net/10')
  .addPlugin(require('raven-js/plugins/angular'), angular)
  .install();

import routesConfig from './routes';

import {main} from './app/main';
import {header} from './app/header';
import {footer} from './app/footer';
import {baseModule} from './app/base/index';
import {filtersModule} from './app/filters/index';
import {sharedModule} from './app/shared/index';
import {pagesModule} from './app/pages/index';
import {financeModule} from './app/finance/index';
import {bourseModule} from './app/bourse/index';
import {lamalModule} from './app/lamal/index';
import {pcModule} from './app/pc/index';
import {ScrollController} from './app/controllers/scroll';

// Material design css
import 'angular-material/angular-material.min.css';

// Icons
import 'font-awesome/css/font-awesome.min.css';

import './index.scss';

/** @ngInject */
const themeConfig = $mdThemingProvider => {
  $mdThemingProvider.definePalette('primaryPalette', $mdThemingProvider.extendPalette('blue', {
    100: '3795C2',
    200: '3795C2',
    300: '3795C2',
    400: '3795C2',
    500: '3795C2',
    600: '225C77',
    700: '3795C2',
    800: '3795C2',
    900: '333333'
    // contrastDefaultColor: 'light',
    // contrastDarkColors: ['50', '100', '200', '300', '400']
  }));
  $mdThemingProvider.theme('default').primaryPalette('primaryPalette', {
    'default': '500',
    'hue-1': '600',
    'hue-2': '900'
  }).accentPalette('indigo');
};

/** @ngInject */
const analyticsConfig = AnalyticsProvider => {
  AnalyticsProvider.setAccount('UA-55173430-6');
  AnalyticsProvider.trackPages(true);
  AnalyticsProvider.trackUrlParams(true);
  AnalyticsProvider.setPageEvent('$stateChangeSuccess');
  AnalyticsProvider.setDomainName('none');
};

/** @ngInject */
const iconConfig = $mdIconProvider => {
  $mdIconProvider.fontSet('fa', 'FontAwesome');
};

/* eslint-disable */
/** @ngInject */
const init = (saver, vars, Analytics) => {
  saver.start();
};
/*eslint-enable */

angular
  .module('app', [
    baseModule,
    filtersModule,
    sharedModule,
    pagesModule,
    financeModule,
    bourseModule,
    lamalModule,
    pcModule,
    angularMaterial,
    angularAnimate,
    angularUIRouter,
    'ui.router.state.events',
    'ngRaven',
    angularGoogleAnalytics])
  .config(routesConfig)
  .config(themeConfig)
  .config(analyticsConfig)
  .config(iconConfig)
  /* eslint-disable */
  .constant('COMMIT_HASH', COMMIT_HASH)
  /*eslint-enable */
  .component('appMain', main)
  .component('appHeader', header)
  .component('appFooter', footer)
  .controller('ScrollController', ScrollController)
  .run(init);
