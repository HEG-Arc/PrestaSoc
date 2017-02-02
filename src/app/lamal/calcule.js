class CalculeLamal {
  // TODO: minmax helper function
  rduLookup(menage, estEtudiant, age, rdu) {
    // calcule offset table trouver la bonne ligne
    return menage + estEtudiant + age + rdu; // minMaxFromTable
  }

  subsideLamalCalcule() {
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
    const rdu = 0;
    const subsideTotal = this.sim.personnes.reduce((total, person) => {
      return total + this.rduLookup(menage, person.estEtudiant, this.sim.age(person), rdu);
    }, 0);

    return subsideTotal;
  }

  subsideMax() {
    return 100;
  }
  
  subsideLamal(sim) {
    this.sim = sim;
    // TODO minmax
    return Math.min(this.subsideLamalCalcule(), this.subsideMax());
  }
}

export default CalculeLamal;
