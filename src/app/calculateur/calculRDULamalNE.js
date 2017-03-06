// REF normes de classification OCAM http://www.ne.ch/autorites/DEAS/SASO/assurance-maladie/Documents/Normes%202017.pdf
// : fortune: "du trente pourcent de la fortune effective après déduction de CHF 4'000.- pour une personne seule, CHF 8'000.- pour un couple, et CHF 2'000.- par enfant mineur à charge, mais par unité économique de référence, au maximum CHF 10'000.-."
// REF http://www.ne.ch/autorites/DEAS/SASO/assurance-maladie/subsidesLAMal/Pages/accueil.aspx

export function calculRDU(sim) {
  return 25000 + 0 * sim.revenuNetImposable;
}
