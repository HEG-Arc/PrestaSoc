import angular from 'angular';

// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';

import angularGoogleAnalytics from 'angular-google-analytics';

import routesConfig from './routes';

import {main} from './app/main';
import {header} from './app/header';
import {footer} from './app/footer';

import {baseModule} from './app/base/index';
import {financeModule} from './app/finance/index';
import {bourseModule} from './app/bourse/index';
import {lamalModule} from './app/lamal/index';
import {pcModule} from './app/pc/index';

// Material design css
import 'angular-material/angular-material.min.css';

// Icons
// import 'font-awesome/css/font-awesome.css';

import './index.scss';

/** @ngInject */
const themeConfig = $mdThemingProvider => {
  $mdThemingProvider.definePalette('primaryPalette', $mdThemingProvider.extendPalette('green', {
    100: 'd6ead8',
    200: 'a8d3af',
    300: '6fbd84',
    400: '1ca75e',
    500: '009640',
    600: '008538',
    700: '007933',
    800: '006228',
    900: '00461A',
    contrastDefaultColor: 'light',
    contrastDarkColors: ['50', '100', '200', '300', '400']
  }));
  $mdThemingProvider.theme('default').primaryPalette('primaryPalette', {
    default: '500'
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
const init = saver => {
  saver.start();
};

angular
  .module('app', [
    baseModule,
    financeModule,
    bourseModule,
    lamalModule,
    pcModule,
    angularMaterial,
    angularAnimate,
    angularUIRouter,
    angularGoogleAnalytics])
  .config(routesConfig)
  .config(themeConfig)
  .config(analyticsConfig)
  .component('appMain', main)
  .component('appHeader', header)
  .component('appFooter', footer)
  .run(init);
