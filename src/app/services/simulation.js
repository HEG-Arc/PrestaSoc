class Simulation {
  constructor() {
    this.personnes = [];
    this.updateEtudiants();
  }

  updateEtudiants() {
    this.etudiants = this.personnes.filter(personne => personne.estEtudiant);
  }

  updateEtudiants() {
    this.etudiants = this.personnes.filter(x => x.estEtudiant);
  }

}

export default Simulation;

