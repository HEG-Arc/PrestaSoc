class Simulation {
  constructor() {
    this.personnes = [];
    this.updateEtudiants();
  }

  updateEtudiants() {
    this.etudiants = this.personnes.filter(personne => personne.estEtudiant);
  }

}

export default Simulation;

