// REF normes de classification OCAM http://www.ne.ch/autorites/DEAS/SASO/assurance-maladie/Documents/Normes%202017.pdf
// : fortune: "du trente pourcent de la fortune effective après déduction de CHF 4'000.- pour une personne seule, CHF 8'000.- pour un couple, et CHF 2'000.- par enfant mineur à charge, mais par unité économique de référence, au maximum CHF 10'000.-."
// REF http://www.ne.ch/autorites/DEAS/SASO/assurance-maladie/subsidesLAMal/Pages/accueil.aspx
const TAUX_MAJORATION = 0.3;
const FORTUNE_DEDUCTION_MENAGE = {seul: 4000, couple: 8000};
const FORTUNE_DEDUCTION_ENFANT = 2000;

export function calculRDU(sim) {
  let rdu = 0;
  const menageRDU = sim.personnes[0].etatCivil === 'U' ||
                 sim.personnes[0].etatCivil === 'M' ||
                 sim.personnes[0].etatCivil === 'P' ? 'couple' : 'seul';
  if (angular.isDefined(sim.revenuNetImposable)) {
    rdu += parseInt(sim.revenuNetImposable, 10);
  }
  // TODO valeur locative privee

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
  fortune -= FORTUNE_DEDUCTION_MENAGE[menageRDU];
  fortune -= FORTUNE_DEDUCTION_ENFANT * sim.personnes.filter(p => !p.estAdulte).length;
  fortune = Math.max(fortune, 0);
  const fortuneImputee = fortune * TAUX_MAJORATION;

  rdu += fortuneImputee;
  return rdu;
}
