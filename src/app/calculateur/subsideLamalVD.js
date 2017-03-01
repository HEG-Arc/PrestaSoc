import {calculRDU} from './calculRDU';

const reductionEnfants = function (nbEnfants) {
  switch (nbEnfants) {
    case 0:
      return 0;
    case 1:
      return 6000;
    case 2:
      return 13000;
    default:
      return 7000 * nbEnfants;
  }
};

function subsideLookup(menage, estEtudiant = false, estBeneficiarePC = false
  , estBeneficiareRI = false, age, rdu, region, subsidesRDU, subsidesRIPC) {
  if (estEtudiant && (age < 19 || age > 25)) {
    estEtudiant = false;
  }
  let subside = {};
  if (estBeneficiarePC || estBeneficiareRI) {
    subside = subsidesRIPC.find(x => {
      return x.menage === menage &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age &&
        x.region === region;
    });
  } else {
    subside = subsidesRDU.find(x => {
      return x.menage === menage &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age &&
        x.rduMin <= rdu &&
        x.rduMax >= rdu;
    });
  }
  if (angular.isDefined(subside)) {
    const subsideEstime = Math.round(subside.subsideMin + (1 - (rdu - subside.rduMin) / (subside.rduMax - subside.rduMin)) *
      (subside.subsideMax - subside.subsideMin));
    return {subsideMin: subside.subsideMin, subsideMax: subside.subsideMax, subsideEstime};
  }
  return {subsideMin: 0, subsideMax: 0, subsideEstime: 0}; // TODO cas ou la personne n'a pas droit au subside
}

export function subsideLamalCalculeVD(sim, subsidesRDU, subsidesRIPC) {
  const nombreEnfants = function (sim) {
    return sim.personnes.reduce((count, person) => {
      if (!person.estAdulte) {
        count++;
      }
      return count;
    }, 0);
  };

  const nbEnfants = nombreEnfants(sim);
  let rduLAMAL = calculRDU(sim);
  rduLAMAL -= reductionEnfants(nbEnfants);
  // les PC famille et la rente pont ne sont pas pris en compte dans le RDU pour les subsides LAMAL.
  if (angular.isDefined(sim.pcFamille)) {
    rduLAMAL += parseInt(sim.pcFamille, 10);
  }
  if (angular.isDefined(sim.rentePont)) {
    rduLAMAL += parseInt(sim.rentePont, 10);
  }

  if (!sim.lieuLogement) {
    return 0;
  }
  const menage = sim.personnes.length > 1 ? 'famille' : 'seul';
  const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0};
  for (let i = 0; i < sim.personnes.length; i++) {
    const person = sim.personnes[i];
    person.subsideLamal = subsideLookup(menage, person.estEtudiant, person.estBeneficiarePC
      , person.estBeneficiareRI, person.age, rduLAMAL
      , sim.lieuLogement.region, subsidesRDU, subsidesRIPC);
    subsideTotal.subsideEstime += person.subsideLamal.subsideEstime;
    subsideTotal.subsideMin += person.subsideLamal.subsideMin;
    subsideTotal.subsideMax += person.subsideLamal.subsideMax;
  }
  return subsideTotal;
}

/*
function calculeLamalTestCas1(sim) {
  angular.copy({
    personnes: [
      {
        prenom: "Alice",
        age: 27,
        estAdulte: true,
        dateNaissance: "1989- 12 - 31T23: 00:00.000Z",
        etatCivil: "C",
        estEtudiant: true,
        niveauEtude: "l3"
      }
    ],
    etudiants: [
      {
        prenom: "Alice",
        age: 27,
        estAdulte: true,
        dateNaissance: "1989- 12 - 31T23: 00:00.000Z",
        etatCivil: "C",
        estEtudiant: true,
        niveauEtude: "l3"
      }
    ],
    lieuLogement: {
      cas: "",
      npa: 1000,
      localite: "Lausanne 25",
      canton: "VD",
      region: 1,
      no: 5586,
      commune: "Lausanne",
      district: "DISTRICT DE LAUSANNE",
      label: "1000 Lausanne"
    },
    logement: "estLocataire",
    revenuNetImposable: 16000,
    revenuFortune: 200,
    fortuneMobiliere: 2000
  }, sim);
}*/
