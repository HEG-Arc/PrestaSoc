import {calculRDU} from './calculRDUVD';

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
const P = 2.3; // REF http://www.vd.ch/fileadmin/user_upload/themes/sante_social/aides_allocations/fichiers_pdf/Arr%C3%AAt%C3%A9_pour_les_subsides_2017.pdf
// const Q = 0.25; // REF http://www.vd.ch/fileadmin/user_upload/themes/sante_social/aides_allocations/fichiers_pdf/Arr%C3%AAt%C3%A9_pour_les_subsides_2017.pdf

function subsideLookup(menage, estEtudiant = false, estBeneficiairePC = false
  , estBeneficiaireRI = false, age, rdu, region, subsidesRDU, subsidesRI, subsidesPC) {
  if (estEtudiant && (age < 19 || age > 25)) {
    estEtudiant = false;
  }
  let subside = {};
  let obj = {};
  if (estBeneficiaireRI) {
    subside = subsidesRI.find(x => {
      return x.menage === menage &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age &&
        x.region === region;
    });
    subside.subsideEstime = subside.subsideMax;
  } else if (estBeneficiairePC) {
    subside = subsidesPC.find(x => {
      return x.menage === menage &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age &&
        x.region === region;
    });
    subside.subsideEstime = subside.subsideMax;
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
    let subsideEstime = 0;
    // REF  http://www.vd.ch/fileadmin/user_upload/themes/sante_social/aides_allocations/fichiers_pdf/Arr%C3%AAt%C3%A9_pour_les_subsides_2017.pdf
    subsideEstime = subside.subsideMin +
              (subside.subsideMax - subside.subsideMin) * Math.pow(1 - Math.pow((rdu - subside.rduMin) / (subside.rduMax - subside.rduMin), 2), P);
    subsideEstime = 10 * Math.round(subsideEstime / 10); // arrondi à la dizaine
    obj = angular.copy(subside);
    if (!Object.prototype.hasOwnProperty.call(obj, "subsideEstime")) {
      obj.subsideEstime = subsideEstime;
    }
    obj.rduLAMAL = rdu;
    return obj;
  }
  return {subsideMin: 0, subsideMax: 0, subsideEstime: 0, rduLAMAL: rdu};
}

export function subsideLamalCalculeVD(sim, subsidesRDU, subsidesRI, subsidesPC) {
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
  const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0, rduLAMAL: 0};
  for (let i = 0; i < sim.personnes.length; i++) {
    const person = sim.personnes[i];
    person.subsideLamal = subsideLookup(menage, person.estEtudiant, person.estBeneficiairePC
      , person.estBeneficiaireRI, person.age, rduLAMAL
      , sim.lieuLogement.region, subsidesRDU, subsidesRI, subsidesPC);
    subsideTotal.subsideEstime += person.subsideLamal.subsideEstime;
    subsideTotal.subsideMin += person.subsideLamal.subsideMin;
    subsideTotal.subsideMax += person.subsideLamal.subsideMax;
    subsideTotal.rduLAMAL = rduLAMAL;
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
