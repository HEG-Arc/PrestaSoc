class Simulation {
  constructor() {
    this.personnes = [];
  }
  getData() {
    return 1 + 2;
  }

  age(person) {
    function calculateAge(birthday) { // birthday is a date
      const ageDifMs = Date.now() - birthday.getTime();
      const ageDate = new Date(ageDifMs); // miliseconds from epoch
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
    return calculateAge(person.dateNaissance);
  }
}

export default Simulation;

