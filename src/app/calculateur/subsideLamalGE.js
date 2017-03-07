import {calculRDU} from './calculRDULamalGE';

function subsideLookup(menage, nbEnfants, age, rduLAMAL, subsidesGERDU) {
  let subside = {};
  subside = subsidesGERDU.find(x => {
    return x.menage === menage &&
      x.nbEnfants === nbEnfants &&
      x.ageMin <= age &&
      x.ageMax >= age &&
      x.rduMin <= rduLAMAL &&
      x.rduMax >= rduLAMAL;
  });
  if (angular.isDefined(subside)) {
    const obj = angular.copy(subside);
    obj.subsideEstime = obj.subside;
    obj.rduLAMAL = rduLAMAL;
    return obj;
  }
  return {menage, nbEnfants, age, rduLAMAL, subsideMin: 0, subsideMax: 0, subsideEstime: 0};
}

export function subsideLamalCalculeGE(sim, subsidesGERDU) {
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
    person.subsideLamal = subsideLookup(menage, nbEnfants, person.age, rduLAMAL
      , subsidesGERDU);
    subsideTotal.subsideEstime += person.subsideLamal.subsideEstime;
    subsideTotal.subsideMax += person.subsideLamal.subsideEstime;
    subsideTotal.rduLAMAL = rduLAMAL;
  }
  return subsideTotal;
}

