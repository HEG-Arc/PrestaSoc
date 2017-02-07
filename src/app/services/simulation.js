function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class Simulation {
  constructor() {
    this.personnes = [];
    this.stats = {
      uuid: uuid(),
      loaded: [new Date().toISOString()]
    };
    this.updateEtudiants();
  }

  updateEtudiants() {
    this.etudiants = this.personnes.filter(personne => personne.estEtudiant);
  }

}

export default Simulation;

