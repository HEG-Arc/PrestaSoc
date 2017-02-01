class LogementController {
  /** @ngInject */
  constructor(simulation) {
    this.sim = simulation;
    this.npaList = [
      '2000 Neuchâtel',
      '1000 Lausanne'
    ];
    this.filterList = txt => {
      return this.npaList.filter(item => {
        return item.indexOf(txt) >= 0;
      });
    };
  }
}

export const logement = {
  templateUrl: 'app/base/logement.html',
  controller: LogementController
};

