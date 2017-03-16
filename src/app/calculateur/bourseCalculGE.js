import {calculRDU} from '../calculateur/calculRDULamalGE';

// REF http://www.guidesocial.ch/fr/fiche/839/

const MAX_BOURSE = {l2: 12000, l3: 16000};
const MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE = 4000;

// REF https://www.ge.ch/legislation/rsg/f/s/rsg_E3_60p04.html
function montantDeBase(sim, etudiant) {
  const ENTRETIEN_ENFANT_JUSQUA_10ANS = 400;
  const ENTRETIEN_ENFANT_PLUSDE_10ANS = 600;

  const enfantsJusqua10ans = sim.personnes.filter(personne => (personne.age <= 10)).length;
  const enfantsPlusde10ans = sim.personnes.filter(personne => (personne.age > 10 && personne.age < 18)).length;
  // débiteur vivant seul
  if (sim.personnes.length === 1 || etudiant.estIndependanceFinanciere) {
    return 1200;
  }
  // débiteur monoparental
  if (sim.personnes.length > 1 && nombreEnfants(sim) === sim.personnes.length - 1) {
    return 1350 + enfantsJusqua10ans * ENTRETIEN_ENFANT_JUSQUA_10ANS + enfantsPlusde10ans * ENTRETIEN_ENFANT_PLUSDE_10ANS;
  }
  // pour un couple marié, deux personnes vivant en partenariat enregistré ou un couple avec des enfants
  if ((sim.personnes.length >= 2 && (sim.personnes[0].etatCivil === 'M' || sim.personnes[0].etatCivil === 'P')) ||
       (sim.personnes.length > 2 && sim.personnes[0].etatCivil === 'U')) {
    return 1700 + enfantsJusqua10ans * ENTRETIEN_ENFANT_JUSQUA_10ANS + enfantsPlusde10ans * ENTRETIEN_ENFANT_PLUSDE_10ANS;
  }
}

function nombreEnfants(sim) {
  return sim.personnes.filter(personne => (!personne.estAdulte)).length;
}

export function bourseEtudeGE(sim) {
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
/*
  Art. 20 Frais résultant de l'entretien et de la formation
  1 Sont considérés comme frais résultant de l'entretien :
    a) un montant de base défini par le règlement;
    b) les frais de logement dans les limites des forfaits majorés de 20% définis par le règlement;(1)
    c) les primes d'assurance-maladie obligatoire dans les limites des forfaits définis par le règlement;
    d) le supplément d'intégration par personne suivant une formation dans les limites des forfaits définis par le règlement;
    e) les impôts cantonaux tels qu'ils figurent dans les bordereaux établis par l'administration fiscale cantonale;
    f) les frais de déplacement et de repas tels qu'ils sont admis par l'administration fiscale cantonale.
  2 Sont considérés comme frais résultant de la formation les forfaits fixés par le règlement.
*/
    charges.push(["Montant de base pour frais d'entretien", montantDeBase(sim, etudiant)]);
    charges.push(["Frais de loyer de la famille", sim.logementLoyerBrut]);

// revenus
/*
Une franchise de 7 800 F est déduite du revenu annuel réalisé par la personne en formation dans le cadre d'une activité lucrative.
comment prendre en compte le revenu de l'étudiant lui-même?
*/
    // répartition du RDU de l'UER entre les étudiants
    revenus.push(["Répartition du revenu déterminant unifié", Math.round(rdu / nbEtudiants)]);

// calcul de la balance du budget
    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    let maxBourse = MAX_BOURSE[niveau];
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
