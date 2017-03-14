import {calculRDU} from './calculRDUNE';

function subsideLookup(menage, nbEnfants, estEtudiant = false, estBeneficiairePC = false
  , estBeneficiaireRI = false, age, rdu, subsidesNEcategories, subsidesNERDU, subsidesNEASPC) {
  if (estEtudiant && age < 19) {
    estEtudiant = false;
  }
  let subside = {};
  let categorie = {};
  if (estBeneficiairePC) {
    categorie = "PC";
    subside = subsidesNEASPC.find(x => {
      return x.classe === categorie &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  }
  if (estBeneficiaireRI) {
    categorie = "AS";
    subside = subsidesNEASPC.find(x => {
      return x.classe === categorie &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  } else {
    categorie = subsidesNEcategories.find(x => {
      return x.menage === menage &&
        x.nbEnfants === nbEnfants &&
        x.formation === estEtudiant &&
        x.rduMin <= rdu &&
        x.rduMax >= rdu;
    });
    subside = subsidesNERDU.find(x => {
      return x.classe === categorie.classe &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  }
  const obj = angular.copy(subside);
  obj.subsideEstime = obj.subsideMax;
  obj.rduLAMAL = rdu;
  obj.menage = menage;
  for (const prop in categorie) {
    if (Object.prototype.hasOwnProperty.call(categorie, prop)) {
      obj[prop] = categorie[prop];
    }
  }
  return obj; // TODO cas ou la personne n'a pas droit au subside
}

export function subsideLamalCalculeNE(sim, subsidesNEcategories, subsidesNERDU, subsidesNEASPC) {
  const rduLAMAL = calculRDU(sim);

  if (!sim.lieuLogement) {
    return 0;
  }

  const menage = sim.personnes[0].etatCivil === 'U' ||
                 sim.personnes[0].etatCivil === 'M' ||
                 sim.personnes[0].etatCivil === 'P' ? 'couple' : 'seul';
  const nbEnfants = sim.personnes.filter(p => !p.estAdulte).length;

  const subsideTotal = {subsideMin: 0, subsideMax: 0, subsideEstime: 0, rduLAMAL: 0};
  for (let i = 0; i < sim.personnes.length; i++) {
    const person = sim.personnes[i];
    person.subsideLamal = subsideLookup(menage, nbEnfants, person.estEtudiant, person.estBeneficiairePC
      , person.estBeneficiaireRI, person.age, rduLAMAL
      , subsidesNEcategories, subsidesNERDU, subsidesNEASPC);
    subsideTotal.subsideEstime += person.subsideLamal.subsideMax;
    subsideTotal.subsideMax += person.subsideLamal.subsideMax;
    subsideTotal.rduLAMAL = rduLAMAL;
  }
  return subsideTotal;
}

