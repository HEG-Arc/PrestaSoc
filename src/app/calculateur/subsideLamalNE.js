import {calculRDU} from './calculRDULamalNE';

function subsideLookup(menage, nbEnfants, estEtudiant = false, estBeneficiarePC = false
  , estBeneficiareRI = false, age, rdu, subsidesNEClasses, subsidesNERDU, subsidesNEASPC) {
  if (estEtudiant && (age < 19 || age > 25)) {
    estEtudiant = false;
  }
  let subside = {};

  if (estBeneficiarePC) {
    subside = subsidesNEASPC.find(x => {
      return x.classe === "PC" &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  }
  if (estBeneficiareRI) {
    subside = subsidesNEASPC.find(x => {
      return x.classe === "AS" &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  } else {
    const classe = subsidesNEClasses.find(x => {
      return x.menage === menage &&
        x.nbEnfants === nbEnfants &&
        x.formation === estEtudiant &&
        x.rduMin <= rdu &&
        x.rduMax >= rdu;
    }).classe;
    subside = subsidesNERDU.find(x => {
      return x.classe === classe &&
        x.formation === estEtudiant &&
        x.ageMin <= age &&
        x.ageMax >= age;
    });
  }
  return subside; // TODO cas ou la personne n'a pas droit au subside
}

export function subsideLamalCalculeNE(sim, subsidesNEClasses, subsidesNERDU, subsidesNEASPC) {
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
    person.subsideLamal = subsideLookup(menage, nbEnfants, person.estEtudiant, person.estBeneficiarePC
      , person.estBeneficiareRI, person.age, rduLAMAL
      , subsidesNEClasses, subsidesNERDU, subsidesNEASPC);
    subsideTotal.subsideEstime += person.subsideLamal.subsideEstime;
    subsideTotal.subsideMin += person.subsideLamal.subsideMin;
    subsideTotal.subsideMax += person.subsideLamal.subsideMax;
    subsideTotal.rduLAMAL = rduLAMAL;
  }
  return subsideTotal;
}

