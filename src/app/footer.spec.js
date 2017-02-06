import angular from 'angular';
import 'angular-mocks';
import {footer} from './footer';

describe('footer component', () => {
  beforeEach(() => {
    angular
      .module('appFooter', ['app/footer.html'])
      .component('appFooter', footer);
    angular.mock.module('appFooter');
  });
});
