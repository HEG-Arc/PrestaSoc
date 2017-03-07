import {calculRDU} from './calculRDUVD';

// const COMMUNES_REGION1 = ["Aclens","Allaman","Apples","Arnex-sur-Nyon","Arzier-Le Muids","Aubonne","Ballens","Bassins","Begnins","Berolle","Bière","Bogis-Bossey","Borex","Bougy-Villars","Bourg-en-Lavaux","Bremblens","Buchillon","Bussigny","Bussy-Chardonney","Chardonne","Chavannes-de-Bogis","Chavannes-des-Bois","Chavannes-le-Veyron","Chavannes-près-Renens","Cheseaux-sur-Lausanne","Chéserex","Chevilly","Chexbres","Chigny","Clarmont","Coinsins","Commugny","Coppet","Corseaux","Corsier-sur-Vevey","Cossonay","Cottens","Crans-près-Céligny","Crassier","Crissier","Cuarnens","Denens","Denges","Dizy","Duillier","Échandens","Échichens","Éclépens","Ecublens","Épalinges","Étoy","Eysins","Féchy","Ferreyres","Founex","Genolier","Gimel","Gingins","Givrins","Gland","Gollion","Grancy","Grens","Jongny","Jouxtens-Mézery","La Chaux (Cossonay)","La Rippe","La Sarraz","Lausanne","Lavigny","Le Mont-sur-Lausanne","Le Vaud","L'Isle","Lonay","Lully","Lussy-sur-Morges","Lutry","Mauraz","Mies","Moiry","Mollens","Montherod","Mont-la-Ville","Montricher","Morges","Nyon","Orny","Pampigny","Pompaples","Prangins","Préverenges","Prilly","Puidoux","Renens","Reverolle","Rivaz","Romanel-sur-Lausanne","Romanel-sur-Morges","Saint-Cergue","Saint-Livres","Saint-Oyens","Saint-Prex","Saint-Saphorin","Saint-Sulpice","Saubraz","Senarclens","Sévery","Signy-Avenex","Tannay","Tolochenaz","Trélex","Vaux-sur-Morges","Vevey","Vich","Villars-sous-Yens","Villars-Ste-Croix","Vufflens-le-Château","Vullierens","Yens"];

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

function subsideLookup(menage, estEtudiant = false, estBeneficiairePC = false
  , estBeneficiaireRI = false, age, rdu, region, subsidesRDU, subsidesRIPC) {
  if (estEtudiant && (age < 19 || age > 25)) {
    estEtudiant = false;
  }
  let subside = {};
  let obj = {};
  if (estBeneficiairePC || estBeneficiaireRI) {
    subside = subsidesRIPC.find(x => {
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
    const subsideEstime = Math.round(subside.subsideMin + (1 - (rdu - subside.rduMin) / (subside.rduMax - subside.rduMin)) *
      (subside.subsideMax - subside.subsideMin));
  //  return {subsideMin: subside.subsideMin, subsideMax: subside.subsideMax, subsideEstime, rduLAMAL: rdu};
    obj = angular.copy(subside);
    if (!Object.prototype.hasOwnProperty.call(obj, "subsideEstime")) {
      obj.subsideEstime = subsideEstime;
    }
    obj.rduLAMAL = rdu;
    return obj;
  }
  return {subsideMin: 0, subsideMax: 0, subsideEstime: 0, rduLAMAL: rdu};
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
  const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0, rduLAMAL: 0};
  for (let i = 0; i < sim.personnes.length; i++) {
    const person = sim.personnes[i];
    person.subsideLamal = subsideLookup(menage, person.estEtudiant, person.estBeneficiairePC
      , person.estBeneficiaireRI, person.age, rduLAMAL
      , sim.lieuLogement.region, subsidesRDU, subsidesRIPC);
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
