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

// Material design css
import 'angular-material/angular-material.css';

// Icons
// import 'font-awesome/css/font-awesome.css';

import './index.scss';

angular
  .module('app', [
    baseModule,
    angularMaterial,
    angularAnimate,
    angularUIRouter])
  .config(routesConfig)
  .component('appMain', main)
  .component('appHeader', header)
  .component('appFooter', footer);
