const TAUX_IMPUTATION_FORTUNE = 1 / 15;

export function calculRDU(sim) {
  let rdu = 0;
  if (angular.isDefined(sim.revenuNetImposable)) {
    rdu += sim.revenuNetImposable;
  }

  // imputation fortune
  let fortune = 0;
  if (angular.isDefined(sim.fortuneImmobiliereLogement)) {
    fortune += parseInt(sim.fortuneImmobiliereLogement, 10);
  }
  if (angular.isDefined(sim.fortuneImmobiliereAutre)) {
    fortune += parseInt(sim.fortuneImmobiliereAutre, 10);
  }
  if (angular.isDefined(sim.fortuneMobiliere)) {
    fortune += parseInt(sim.fortuneMobiliere, 10);
  }
  if (angular.isDefined(sim.fortuneCommerciale)) {
    fortune += parseInt(sim.fortuneCommerciale, 10);
  }

  rdu += TAUX_IMPUTATION_FORTUNE * fortune;

  return rdu;
}
