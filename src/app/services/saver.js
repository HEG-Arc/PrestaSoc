import Simulation from './simulation';

const STORAGE_KEY = 'prestasoc';
const STORAGE_KEY_STATE = `${STORAGE_KEY}_state`;
const PAGES_STATES = ['main', 'about', 'addresses'];

class Saver {
  /** @ngInject */
  constructor($rootScope, simulation, $log, $http) {
    $rootScope.sim = simulation;
    this.$rootScope = $rootScope;
    this.$log = $log;
    this.$http = $http;
  }

  log() {
    this.$http.post('https://dev.jestime.ch/log', angular.toJson(this.$rootScope.sim))
    .catch(() => {
    });
  }

  start() {
    try {
      const simJson = localStorage.getItem(STORAGE_KEY);
      if (simJson) {
        const loadedSim = angular.fromJson(simJson);
        angular.copy(loadedSim, this.$rootScope.sim);
      }
      this.$rootScope.sim.stats.loaded.push(new Date().toISOString());
    } catch (e) {

    }
    try {
      const stateJson = localStorage.getItem(STORAGE_KEY_STATE);
      if (stateJson) {
        this.loadedState = angular.fromJson(stateJson);
      }
    } catch (e) {

    }
    this.__cancelWatchSim = this.$rootScope.$watch('sim', () => {
      localStorage.setItem(STORAGE_KEY, angular.toJson(this.$rootScope.sim));
    }, true);
    this.__cancelWatchState = this.$rootScope.$on('$stateChangeSuccess', (event, toState, toParams) => {
      if (!(PAGES_STATES.indexOf(toState.name) > -1)) {
        this.log();
        localStorage.setItem(STORAGE_KEY_STATE, angular.toJson({state: toState, params: toParams}));
      }
    });
  }

  restart() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_STATE);
    angular.copy(new Simulation(), this.$rootScope.sim);
  }

  stop() {
    if (angular.isFuction(this.__cancelWatchSim)) {
      this.__cancelWatchSim();
    }
    if (angular.isFuction(this.__cancelWatchState)) {
      this.__cancelWatchState();
    }
  }
}

export default Saver;

