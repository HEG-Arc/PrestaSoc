class CalculeLamal {
  // TODO: minmax helper function
  rduLookup(menage, estEtudiant = 0, age, rdu) {
    let subsides = [ 
      { "menage": "famille", "formation": 0, "ageMin": 0, "ageMax": 18, "rduMin": 0, "rduMax": 23000, "subsideMin": 93, "subsideMax": 93 },
      { "menage": "famille", "formation": 0, "ageMin": 0, "ageMax": 18, "rduMin": 23001, "rduMax": 58000, "subsideMin": 65, "subsideMax": 93 },
      { "menage": "famille", "formation": 0, "ageMin": 0, "ageMax": 18, "rduMin": 58001, "rduMax": 76000, "subsideMin": 30, "subsideMax": 65 },
      { "menage": "famille", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 0, "rduMax": 24200, "subsideMin": 300, "subsideMax": 336 },
      { "menage": "famille", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 24201, "rduMax": 55000, "subsideMin": 20, "subsideMax": 300 },
      { "menage": "famille", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 55001, "rduMax": 69000, "subsideMin": 20, "subsideMax": 20 },
      { "menage": "famille", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 0, "rduMax": 24200, "subsideMin": 300, "subsideMax": 336 },
      { "menage": "famille", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 24201, "rduMax": 55000, "subsideMin": 20, "subsideMax": 300 },
      { "menage": "famille", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 55001, "rduMax": 69000, "subsideMin": 20, "subsideMax": 20 },
      { "menage": "famille", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 0, "rduMax": 23000, "subsideMin": 300, "subsideMax": 300 },
      { "menage": "famille", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 23001, "rduMax": 58000, "subsideMin": 200, "subsideMax": 300 },
      { "menage": "famille", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 58001, "rduMax": 69000, "subsideMin": 20, "subsideMax": 200 },
      { "menage": "seul", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 0, "rduMax": 17000, "subsideMin": 331, "subsideMax": 331 },
      { "menage": "seul", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 17001, "rduMax": 36000, "subsideMin": 30, "subsideMax": 331 },
      { "menage": "seul", "formation": 0, "ageMin": 19, "ageMax": 25, "rduMin": 36001, "rduMax": 47000, "subsideMin": 30, "subsideMax": 30 },
      { "menage": "seul", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 0, "rduMax": 17000, "subsideMin": 331, "subsideMax": 331 },
      { "menage": "seul", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 17001, "rduMax": 36000, "subsideMin": 30, "subsideMax": 331 },
      { "menage": "seul", "formation": 0, "ageMin": 26, "ageMax": 130, "rduMin": 36001, "rduMax": 47000, "subsideMin": 30, "subsideMax": 30 },
      { "menage": "seul", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 0, "rduMax": 17000, "subsideMin": 331, "subsideMax": 331 },
      { "menage": "seul", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 17001, "rduMax": 36000, "subsideMin": 200, "subsideMax": 331 },
      { "menage": "seul", "formation": 1, "ageMin": 19, "ageMax": 25, "rduMin": 36001, "rduMax": 47000, "subsideMin": 30, "subsideMax": 30 }
      ];
      let r = subsides.find(x => x.menage === menage 
                                && x.formation == estEtudiant
                                && x.ageMin <= age && x.ageMax >= age
                                && x.rduMin <= rdu && x.rduMax >= rdu
                                    );
      let subsideEstime =  Math.round(r.subsideMin + (1-(rdu-r.rduMin) / (r.rduMax-r.rduMin)) * (r.subsideMax-r.subsideMin));
      return {subsideMin : r.subsideMin, subsideMax: r.subsideMax, subsideEstime : subsideEstime};
  }

  subsideLamalCalcule() {
    const menage = this.sim.personnes.length > 1 ? 'famille' : 'seul';
    const rdu = 0;
    const subsideTotal = this.sim.personnes.reduce((total, person) => {
      return total + this.rduLookup(menage, person.estEtudiant, this.sim.age(person), rdu).subsideEstime;
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
