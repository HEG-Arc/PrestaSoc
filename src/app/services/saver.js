import Simulation from './simulation';

const STORAGE_KEY = 'prestasoc';

class Saver {
  /** @ngInject */
  constructor($rootScope, simulation, $log) {
    $rootScope.sim = simulation;
    this.$rootScope = $rootScope;
    this.$log = $log;
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
    this.__cancelWatchSim = this.$rootScope.$watch('sim', () => {
      localStorage.setItem(STORAGE_KEY, angular.toJson(this.$rootScope.sim));
    }, true);
  }

  restart() {
    localStorage.removeItem(STORAGE_KEY);
    angular.copy(new Simulation(), this.$rootScope.sim);
  }

  stop() {
    if (angular.isFuction(this.__cancelWatchSim)) {
      this.__cancelWatchSim();
    }
  }
}

export default Saver;

