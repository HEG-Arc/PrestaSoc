import {calculRDU} from '../calculateur/calculRDUNE';

// REF http://www.guidesocial.ch/fr/fiche/690/

const MAX_BOURSE = 24000;
const MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE = 6000;

const FRAIS_FORMATION = {l2: 800, l3: 2200};

const FRAIS_LOGEMENT_SEPARE_ENTRETIEN = 12310;
const FRAIS_LOGEMENT_SEPARE = 6000;

function fraisRepasForfait(lev) {
  const FORFAIT_REPAS_JOUR = 10;
  if (lev === "l2-Apprentissages") {
    return 235 * FORFAIT_REPAS_JOUR; // disons que les apprentis ont 5 semaines de vacances
  } else if (lev.substring(0, 2) === "l2") {
    return 190 * FORFAIT_REPAS_JOUR; // le secondaire II a 14 semaines de vacances
  }
  return 150 * FORFAIT_REPAS_JOUR; // université: 30 semaines de cours /an
}

function fraisEntretien(nbPersonnes) {
  let fraisEntretien = 0;
  switch (nbPersonnes) {
    case 1: fraisEntretien = 977;
      break;
    case 2: fraisEntretien = 743;
      break;
    case 3: fraisEntretien = 605;
      break;
    case 4: fraisEntretien = 523;
      break;
    case 5: fraisEntretien = 473;
      break;
    case 6: fraisEntretien = 440;
      break;
    case 7: fraisEntretien = 416;
      break;
    default: fraisEntretien = 274;
  }
  return 1.15 * fraisEntretien * nbPersonnes; // REF http://rsn.ne.ch/DATA/program/books/rsne/htm/4181100.htm#_ftnref6
}

function nombreEnfants(sim) {
  return sim.personnes.filter(personne => (!personne.estAdulte)).length;
}

export function bourseEtudeNE(sim) {
  let boursesTotales = 0;
  const rdu = calculRDU(sim);
  const nbEtudiants = sim.etudiants.length;
  for (let i = 0; i < nbEtudiants; i++) {
    const etudiant = sim.etudiants[i];
    const charges = [];
    const revenus = [];
    let montantBourse = 0;
    const niveau = etudiant.niveauEtude.substring(0, 2);

// charges
    charges.push(["Frais d'entretien de la famille", fraisEntretien(sim.personnes.length)]);

    // frais de logement: "Les frais effectifs de logement mais limités à un plafond dépendant du nombre de personnes et de sa localisation"
    // pas trouvé le plafond dans l'Arrêté fixant les normes pour le calcul de l'aide matérielle, ni dans les autres sources citées
    charges.push(["Frais de loyer de la famille", sim.logementLoyerBrut]);

    charges.push(["Frais de formation", FRAIS_FORMATION[niveau]]);

    if (etudiant.aLogementSepare) {
      charges.push(["Frais d'entretien pour logement séparé", FRAIS_LOGEMENT_SEPARE_ENTRETIEN]);
      charges.push(["Forfait loyer pour logement séparé", FRAIS_LOGEMENT_SEPARE]);
    }

    charges.push(["Forfait pour frais de repas", fraisRepasForfait(etudiant.niveauEtude)]);

// revenus
    // répartition du RDU de l'UER entre les étudiants
    revenus.push(["Répartition du revenu déterminant unifié", Math.round(rdu / nbEtudiants)]);

// TODO: salaire perçu par l'étudiant 80% des revenus obtenus dans le cadre de la formation après déduction d'un montant forfaitaire de 3'000 francs pour le secondaire II et de 4'800 francs pour le tertiaire
// calcul de la balance du budget
    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    let maxBourse = MAX_BOURSE;
    if (i === 0) { // enfants a charge de l'etudiant si celui-ci est le requérant principal
      maxBourse += nombreEnfants(sim) * MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE;
    }
    montantBourse = Math.min(montantBourse, maxBourse);
    montantBourse = 10 * Math.round(montantBourse / 10); // arrondi dizaine
    etudiant.bourseEtude = {charges, revenus, chargesTotales, revenusTotaux, montantBourse};
    boursesTotales += montantBourse;
  }
  return boursesTotales;
}
