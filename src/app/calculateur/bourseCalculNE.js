import {calculRDU} from '../calculateur/calculRDUNE';

// REF http://www.guidesocial.ch/fr/fiche/690/

const MAX_BOURSE = 24000;
const MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE = 6000;

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
    default: fraisEntretien = 274 * nbPersonnes;
  }
  return 1.15 * fraisEntretien; // REF http://rsn.ne.ch/DATA/program/books/rsne/htm/4181100.htm#_ftnref6
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

// charges
    revenus.push(["Frais d'entretien", fraisEntretien(sim.personnes.length)]);
// revenus
    // répartition du RDU de l'UER entre les étudiants
    revenus.push(["Répartition du revenu déterminant unifié", Math.round(rdu / nbEtudiants)]);

    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    let maxBourse = MAX_BOURSE;
    if (i === 0) { // enfants a charge de l'etudiant si celui-ci est le requérant principal
      maxBourse += nombreEnfants(sim) * MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE;
    }
    montantBourse = Math.max(montantBourse, maxBourse());
    montantBourse = 10 * Math.round(montantBourse / 10); // arrondi dizaine
    // TODO si le revenu est égal à l'ensemble des charges, l'OCBE octroie une aide pour les frais d'études uniquement;
    etudiant.bourseEtude = {charges, revenus, chargesTotales, revenusTotaux, montantBourse};
    boursesTotales += montantBourse;
  }
  return boursesTotales;
}
