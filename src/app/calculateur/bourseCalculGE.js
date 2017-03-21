import {calculRDU} from '../calculateur/calculRDULamalGE';

// REF http://www.guidesocial.ch/fr/fiche/839/

const MAX_BOURSE = {l2: 12000, l3: 16000};
const NIVEAU_TEXTE = {l2: "secondaire II", l3: "tertiaire"};
const MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE = 4000;

const FORFAIT_REPAS = 3200;

const FRANCHISE_ACTIVITE_LUCRATIVE = 7800;

const FRAIS_FORMATION = {l2: 2000, l3: 3000};

const SUPPLEMENT_INTEGRATION = 1200;

function fraisTransport(age, cantonResidence, cantonEtude) {
  if (cantonResidence === cantonEtude) {
    if (age <= 25) {
      return 540;
    }
    return 840;
  }
  if (age <= 30) {
    return 2400;
  }
  return 3350;
}

function forfaitLamal(age) {
  if (age <= 18) {
    return 1560;
  } else if (age <= 25) {
    return 6252;
  }
  return 6648;
}

function nbMineursEtEtudiants(sim) {
  return sim.personnes.filter(x => x.age <= 18 || (x.age <= 25 && x.estEtudiant)).length;
}

// REF https://www.ge.ch/legislation/rsg/f/s/rsg_E3_60p04.html
function montantDeBase(sim) {
  const ENTRETIEN_ENFANT_JUSQUA_10ANS = 400;
  const ENTRETIEN_ENFANT_PLUSDE_10ANS = 600;

  const enfantsJusqua10ans = sim.personnes.filter(personne => (personne.age <= 10)).length;
  const enfantsPlusde10ans = sim.personnes.filter(personne => (personne.age > 10 && personne.age < 18)).length;
  // débiteur vivant seul
  if (sim.personnes.length === 1) /* || etudiant.estIndependanceFinanciere)*/ {
    return 1200 * 12;
  }
  // débiteur monoparental
  if (sim.personnes.length > 1 && nbMineursEtEtudiants(sim) === sim.personnes.length - 1) {
    return 12 * (1350 + enfantsJusqua10ans * ENTRETIEN_ENFANT_JUSQUA_10ANS + enfantsPlusde10ans * ENTRETIEN_ENFANT_PLUSDE_10ANS);
  }
  // pour un couple marié, deux personnes vivant en partenariat enregistré ou un couple avec des enfants
  if ((sim.personnes.length >= 2 && (sim.personnes[0].etatCivil === 'M' || sim.personnes[0].etatCivil === 'P')) ||
       (sim.personnes.length > 2 && sim.personnes[0].etatCivil === 'U')) {
    return 12 * (1700 + enfantsJusqua10ans * ENTRETIEN_ENFANT_JUSQUA_10ANS + enfantsPlusde10ans * ENTRETIEN_ENFANT_PLUSDE_10ANS);
  }
}

function nombreEnfants(sim) {
  return sim.personnes.filter(personne => (!personne.estAdulte)).length;
}

export function bourseEtudeGE(sim) {
  let boursesTotales = 0;
  const bourses = {UER: {charges: [], revenus: [], solde: 0}, etudiants: []};
  const rdu = calculRDU(sim);
  const nbEtudiants = sim.etudiants.length;

  // budget famille
  // charges
  bourses.UER.charges.push(["Montant de base pour frais d'entretien", montantDeBase(sim)]);
  for (let p = 0; p < sim.personnes.length; p++) {
    bourses.UER.charges.push([`Frais d'assurance maladie ${sim.personnes[p].prenom}`, forfaitLamal(sim.personnes[p].age)]);
  }

  bourses.UER.charges.push(["Supplément d'intégration", sim.etudiants.length * SUPPLEMENT_INTEGRATION]);
  bourses.UER.charges.push(["Frais de loyer de la famille", sim.logementLoyerBrut]);

  if (sim.personnes[0].estEtudiant) {
    const fraisDeplacements = fraisTransport(sim.personnes[0].age, sim.lieuLogement.canton, sim.personnes[0].lieuInstitution.canton);
    bourses.UER.charges.push(["Frais de déplacement liés à la formation des parents", fraisDeplacements]);
    bourses.UER.charges.push(["Frais de repas liés à la formation des parents", FORFAIT_REPAS]);
    bourses.UER.charges.push(["Frais de formation des parents", FRAIS_FORMATION[sim.personnes[0].niveauEtude.niveau]]);
  }
  // revenus
  bourses.UER.revenus.push(["Revenu déterminant unifié", Math.round(rdu)]);

  // balance du budget
  bourses.UER.solde = bourses.UER.revenus.reduce((total, charge) => total + charge[1], 0) -
                      bourses.UER.charges.reduce((total, charge) => total + charge[1], 0);

  // contribution par enfant ou jeune en formation
  const nbEnfantsOuJeune = nbMineursEtEtudiants(sim);
  bourses.UER.contributionParEnfant = nbEnfantsOuJeune > 0 ? bourses.UER.solde / nbEnfantsOuJeune : bourses.UER.solde;
  // budget personne en formation
  for (let i = 0; i < nbEtudiants; i++) {
    const etudiant = sim.etudiants[i];
    const charges = [];
    const revenus = [];
    const niveau = etudiant.niveauEtude.niveau;

    // charges
    const fraisDeplacements = fraisTransport(etudiant.age, sim.lieuLogement.canton, etudiant.lieuInstitution.canton);
    charges.push(["Frais de déplacement", fraisDeplacements]);
    charges.push(["Forfait pour frais de repas", FORFAIT_REPAS]);
    charges.push(["Frais de formation", FRAIS_FORMATION[niveau]]);

    // revenus
    if (angular.isDefined(etudiant.revenueAuxiliaireSalaire)) {
      revenus.push(["Activité lucrative de la personne en formation", etudiant.revenueAuxiliaireSalaire]);
      revenus.push(["Franchise activité lucrative", -Math.min(etudiant.revenueAuxiliaireSalaire, FRANCHISE_ACTIVITE_LUCRATIVE)]);
    }
    if (angular.isDefined(etudiant.revenueAuxiliaireContributionsEntretien)) {
      revenus.push(["Contributions d'entretien", etudiant.revenueAuxiliaireContributionsEntretien]);
    }
    if (angular.isDefined(etudiant.revenueAuxiliairesAutresPrestationsFinancieres)) {
      revenus.push(["Autres prestations financières", etudiant.revenueAuxiliairesAutresPrestationsFinancieres]);
    }

    // calcul de la balance du budget
    const solde = revenus.reduce((total, charge) => total + charge[1], 0) -
                      charges.reduce((total, charge) => total + charge[1], 0);
    const contribParents = bourses.UER.contributionParEnfant;

    const aide = [];

    if (solde >= 0) {
      aide.push(["Excédent de ressources", solde, "add"]);
    } else {
      aide.push(["Découvert", -solde, "substract"]);
    }
    if (contribParents >= 0) {
      aide.push(["Contribution parentale", contribParents, "add"]);
    } else {
      aide.push(["Part de la personne en formation des frais du ménage non couverts", -contribParents, "substract"]);
    }
    const decouvertTotal = -1 * aide.reduce((total, montant) =>
                          montant[2] === 'add' ? total + montant[1] : total - montant[1], 0);
    aide.push(["Total du découvert", decouvertTotal]);
    const maxBourse = MAX_BOURSE[niveau];
    let maxBourseEnfants = 0;
    aide.push([`Montant maximal selon le degré (${NIVEAU_TEXTE[niveau]})`, maxBourse]);
    if (i === 0) { // enfants a charge de l'etudiant si celui-ci est le requérant principal
      maxBourseEnfants = nombreEnfants(sim) * MAX_BOURSE_INCREMENT_ENFANT_A_CHARGE;
      aide.push(["Majoration du maximum pour enfants à charge", maxBourseEnfants]);
    }
    let montantAide = decouvertTotal < 500 ? 0 : decouvertTotal;
    montantAide = Math.min(montantAide, maxBourse + maxBourseEnfants);
    montantAide = 10 * Math.round(montantAide / 10); // arrondi dizaine
    aide.push(["Montant de l'aide possible", montantAide]);
    boursesTotales += montantAide;
    bourses.etudiants.push({prenom: etudiant.prenom, charges, revenus, solde, aide});
  }
  sim.bourses = bourses;
  return boursesTotales;
}
