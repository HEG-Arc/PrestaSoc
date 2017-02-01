import angular from 'angular';

import {techsModule} from './app/techs/index';

// Material design css
import 'angular-material/angular-material.css';
// Icons
import 'font-awesome/css/font-awesome.css';
// Animation
import angularAnimate from 'angular-animate';
// Materail Design lib
import angularMaterial from 'angular-material';
// Router
import angularUIRouter from 'angular-ui-router';

// Icons
//import 'font-awesome/css/font-awesome.css';

import routesConfig from './routes';

import {main} from './app/main';
import {header} from './app/header';
import {title} from './app/title';
import {footer} from './app/footer';

import 'angular-material/angular-material.css';
import './index.scss';

angular
  .module('app', [techsModule,
    angularMaterial,
    angularAnimate,
    angularUIRouter])
  .config(routesConfig)
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainTitle', title)
  .component('fountainFooter', footer);
