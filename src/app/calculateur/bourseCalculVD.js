import {calculRDU} from '../calculateur/calculRDUVD';

// REF http://www.guidesocial.ch/fr/fiche/960/

function nombreEnfants(sim) {
  return sim.personnes.filter(personne => (!personne.estAdulte)).length;
}

function chargesNormalesBaseLookup(chargesNormalesBaseVD, nbAdultes = 1, nbEnfants = 0, zone = 2) {
  return chargesNormalesBaseVD.find(x => {
    return x.zone === zone &&
      x.nbAdultes === nbAdultes &&
      x.nbEnfants === nbEnfants;
  }).chargesNormales;
}

function chargesNormalesIndependantLookup(chargesNormalesIndependantVD, nbAdultes = 1, nbEnfants = 0, zone = 2) {
  return chargesNormalesIndependantVD.find(x => {
    return x.zone === zone &&
      x.nbAdultes === nbAdultes &&
      x.nbEnfants === nbEnfants;
  }).chargesNormales;
}

function chargesNormalesComplementairesLookup(chargesNormalesComplementairesVD, age) {
  return chargesNormalesComplementairesVD.find(x => {
    return x.ageMin <= age &&
      x.ageMax >= age;
  }).forfait;
}

function fraisEtudeLookup(fraisEtudeVD, mode, categorie) {
  return fraisEtudeVD.find(x => {
    return x.mode === mode &&
        x.categorie === categorie;
  }).fraisEtude;
}

export function bourseEtudeVD(sim, chargesNormalesBaseVD,
  fraisEtudeVD, chargesNormalesIndependantVD,
  fraisTransportVD, chargesNormalesComplementairesVD, bourseZonesVD) {
  let boursesTotales = 0;
  const rdu = calculRDU(sim);
  for (let i = 0; i < sim.etudiants.length; i++) {
    const etudiant = sim.etudiants[i];
    const charges = [];
    const revenus = [];
    let montantBourse = 0;

    const zone = bourseZonesVD.find(x => {
      return x.district === sim.lieuLogement.district;
    }).zone;
    const nbAdultes = sim.personnes.filter(personne => (personne.estAdulte)).length;
    const nbEnfants = nombreEnfants(sim);
    let chargesNormalesBaseFoyer = 0;
    if (etudiant.estIndependanceFinanciere) {
      chargesNormalesBaseFoyer = chargesNormalesIndependantLookup(chargesNormalesIndependantVD, nbAdultes, nbEnfants, zone);
    } else {
      chargesNormalesBaseFoyer = chargesNormalesBaseLookup(chargesNormalesBaseVD, nbAdultes, nbEnfants, zone);
    }
    charges.push(["Charges normales de base", chargesNormalesBaseFoyer]);

    const chargesNormalesComplementaires = chargesNormalesComplementairesLookup(chargesNormalesComplementairesVD, etudiant.age);
    charges.push(["Charges normales complementaires", chargesNormalesComplementaires]);

    const fraisRepasForfait = 1500;
    charges.push(["Forfait pour frais de repas", fraisRepasForfait]);

    if (etudiant.aLogementSepare) {
      const fraisLogementSepareForfait = (500 + 280) * 10;
      charges.push(["Forfait pour frais de logement séparé", fraisLogementSepareForfait]);
    }
    // TODO compute frais transports
    const fraisTransportForfait = 1000;
    charges.push(["Forfait pour frais de transport", fraisTransportForfait]);

    let fraisEtude = 0;
    const niveau = etudiant.niveauEtude.substring(3);
    const mode = etudiant.formationRedoublementOuTempsPartiel ? "tpr" : "pt";
    fraisEtude = fraisEtudeLookup(fraisEtudeVD, mode, niveau);
    charges.push(["Frais d'étude", fraisEtude]);

    revenus.push(["Revenu déterminant unifié", rdu]);
    if (etudiant.revenueAuxiliaireContributionsEntretien) {
      revenus.push(["Contributions d'entretien", etudiant.revenueAuxiliaireContributionsEntretien]);
    }
    if (etudiant.revenueAuxiliairesAutresPrestationsFinancieres) {
      revenus.push(["Autres prestations financières", etudiant.revenueAuxiliairesAutresPrestationsFinancieres]);
    }

    if (etudiant.aParentLogementAutreFoyer) {
      const etatCivilFoyer2 = etudiant.nbAdultesFoyer2 > 1 ? 'M' : 'C'; // FIXME etat civil 2e foyer
      const rduData = {
        revenuNetImposable: etudiant.revenuNetFoyer2,
        fortuneImmobiliereLogement: etudiant.fortuneImmobiliereFoyer2,
        fortuneImmobiliereAutre: etudiant.autresFortuneImmobiliereFoyer2,
        fortuneMobiliere: etudiant.fortuneMobiliereFoyer2,
        fraisAccessoiresLogement: etudiant.fraisAccessoiresFoyer2,
        personnes: [{etatCivil: etatCivilFoyer2}]
        // rentePrevoyancePrivee
      };

      const rduFoyer2 = calculRDU(rduData);
      revenus.push(["Revenu déterminant du foyer du 2e parent", rduFoyer2]);
      const chargesNormalesBaseFoyer2 = chargesNormalesBaseLookup(etudiant.nbAdultesFoyer2, etudiant.nbEnfantsFoyer2);
      // TODO faudrait-il prendre en compte le nombre d'étudiants dans le 2e foyer pour calculer leurs charges?
      charges.push(["Charges normales de bases du foyer du 2e parent", chargesNormalesBaseFoyer2]);
    }

    // TODO charges fiscales
    const chargesTotales = charges.reduce((total, charge) => total + charge[1], 0);
    const revenusTotaux = revenus.reduce((total, revenu) => total + revenu[1], 0);
    montantBourse = Math.min(revenusTotaux - chargesTotales, 0);
    montantBourse = Math.abs(montantBourse);
    montantBourse = 10 * Math.round(montantBourse / 10); // arrondi dizaine
    // TODO si le revenu est égal à l'ensemble des charges, l'OCBE octroie une aide pour les frais d'études uniquement;
    etudiant.bourseEtude = {charges, revenus, chargesTotales, revenusTotaux, montantBourse};
    boursesTotales += montantBourse;
  }
  return boursesTotales;
}
