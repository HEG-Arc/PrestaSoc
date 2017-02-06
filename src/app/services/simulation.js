class Simulation {
  constructor() {
    this.personnes = [];
  }

  updateEtudiants() {
    this.etudiants = this.personnes.filter(x => x.estEtudiant);
  }

}

export default Simulation;

