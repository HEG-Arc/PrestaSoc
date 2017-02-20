const FRANCHISE_FORTUNE = {
  seul: 56000,
  couple: 112000
};
const TAUX_MAJORATION = 1 / 15;
const FRANCHISE_FORTUNE_IMMOBILIERE_LOGEMENT = 300000;

function imputationFortune(sim) {
  const menageRDU = sim.personnes[0].etatCivil === 'C' ||
    sim.personnes[0].etatCivil === 'D' ||
    sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";

  let fortune = 0;
  if (angular.isDefined(sim.fortuneImmobiliereLogement)) {
    fortune += parseInt(sim.fortuneImmobiliereLogement, 10);
    fortune -= Math.min(FRANCHISE_FORTUNE_IMMOBILIERE_LOGEMENT, parseInt(sim.fortuneImmobiliereLogement, 10));
  }
  if (angular.isDefined(sim.fortuneImmobiliereAutre)) {
    fortune += parseInt(sim.fortuneImmobiliereAutre, 10);
  }
  if (angular.isDefined(sim.fortuneMobiliere)) {
    fortune += parseInt(sim.fortuneMobiliere, 10);
  }
  fortune -= FRANCHISE_FORTUNE[menageRDU];
  fortune = Math.max(fortune, 0);
  return fortune * TAUX_MAJORATION;
}

export function calculRDU(sim) {
  let rdu = 0;
  if (angular.isDefined(sim.revenuNetImposable)) {
    rdu += parseInt(sim.revenuNetImposable, 10);
  }
  if (angular.isDefined(sim.rentePrevoyancePrivee)) {
    rdu += parseInt(sim.rentePrevoyancePrivee, 10);
  }
  if (angular.isDefined(sim.fraisAccessoiresLogement)) {
    rdu -= parseInt(sim.fraisAccessoiresLogement, 10);
  }
  rdu += imputationFortune(sim);
  return rdu;
}
