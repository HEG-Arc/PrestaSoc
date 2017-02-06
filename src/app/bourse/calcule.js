class CalculeBourse {

  /** @ngInject */
  constructor($http) {
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

  subsideLamal(sim) {
    this.sim = sim;
    return this.bourseEtudeCalcule(this.calculRDU());
  }

}

export default CalculeBourse;
