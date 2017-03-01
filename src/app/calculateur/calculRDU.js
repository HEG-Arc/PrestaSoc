const FRANCHISE_FORTUNE = {
  seul: 56000,
  couple: 112000 // REF http://www.vd.ch/fileadmin/user_upload/organisation/dsas/cd/fichiers_pdf/RDU_juillet_2013.pdf
};
const TAUX_MAJORATION = 1 / 15; // REF http://www.vd.ch/fileadmin/user_upload/organisation/dsas/cd/fichiers_pdf/RDU_juillet_2013.pdf
const FRANCHISE_FORTUNE_IMMOBILIERE_LOGEMENT = 300000; // REF http://www.vd.ch/fileadmin/user_upload/organisation/dsas/cd/fichiers_pdf/RDU_juillet_2013.pdf
const FRANCHISE_FORTUNE_COMMERCIALE = 100000; // REF http://www.vd.ch/fileadmin/user_upload/themes/sante_social/aides_allocations/fichiers_pdf/OV_Notice_2017_web.pdf

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
  if (angular.isDefined(sim.fortuneCommerciale)) {
    let fortuneCommercialeRDU = parseInt(sim.fortuneCommerciale, 10);
    fortuneCommercialeRDU -= Math.min(fortuneCommercialeRDU, FRANCHISE_FORTUNE_COMMERCIALE);
    fortune += fortuneCommercialeRDU;
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
  if (angular.isDefined(sim.versementsPrevoyancePrivee)) {
    rdu += parseInt(sim.versementsPrevoyancePrivee, 10);
  }
  if (angular.isDefined(sim.fraisAccessoiresLogement)) {
    rdu -= parseInt(sim.fraisAccessoiresLogement, 10);
  }
  rdu += imputationFortune(sim);
  return rdu;
}
