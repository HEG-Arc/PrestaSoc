import angular from 'angular';

// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';

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

angular
  .module('app', [
    baseModule,
    financeModule,
    bourseModule,
    lamalModule,
    pcModule,
    angularMaterial,
    angularAnimate,
    angularUIRouter])
  .config(routesConfig)
  .component('appMain', main)
  .component('appHeader', header)
  .component('appFooter', footer);
