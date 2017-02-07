class CalculeBourse {

  /** @ngInject */
  constructor($http) {
    this.chargesNormalesBase = {};
    this.fraisEtude = {};
    this.chargesNormalesIndependant = {};
    this.fraisTransport = {};

    $http.get('app/bourse/chargesNormalesBase.json').then(resp => {
      this.chargesNormalesBase = resp.data;
    });
    $http.get('app/bourse/fraisEtude.json').then(resp => {
      this.fraisEtude = resp.data;
    });
    $http.get('app/bourse/chargesNormalesIndependant.json').then(resp => {
      this.chargesNormalesIndependant = resp.data;
    });
    $http.get('app/bourse/fraisTransport.json').then(resp => {
      this.fraisTransport = resp.data;
    });
  }

  bourseEtude(sim) {
    this.sim = sim;
    return this.bourseEtudeCalcule(this.calculRDU());
  }

}

export default CalculeBourse;
