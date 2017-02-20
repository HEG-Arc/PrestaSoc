class CalculRDU {

  calculRDU(sim) {
    // const nombreEnfants = function (sim) {
    //     return sim.personnes.reduce((count, person) => {
    //         if (!person.estAdulte) {
    //             count++;
    //           }
    //         return count;
    //       }, 0);
    //   };

    // const reductionEnfants = function (nbEnfants) {
    //     switch (nbEnfants) {
    //         case 0:
    //           return 0;
    //         case 1:
    //           return 6000;
    //         case 2:
    //           return 13000;
    //         default:
    //           return 7000 * nbEnfants;
    //       }
    //   };

    const imputationFortune = function (sim) {
        const franchiseFortune = {
            seul: 56000,
            couple: 112000
          };
        const tauxMajoration = 1 / 15;
        const menageRDU = sim.personnes[0].etatCivil === 'C' ||
                sim.personnes[0].etatCivil === 'D' ||
                sim.personnes[0].etatCivil === 'V' ? "seul" : "couple";

        let fortune = 0;
        if (angular.isDefined(sim.fortuneImmobiliereLogement)) {
            fortune += parseInt(sim.fortuneImmobiliereLogement, 10);
            fortune -= Math.min(300000, parseInt(sim.fortuneImmobiliereLogement, 10));
          }
        if (angular.isDefined(sim.fortuneImmobiliereAutre)) {
            fortune += parseInt(sim.fortuneImmobiliereAutre, 10);
          }
        if (angular.isDefined(sim.fortuneMobiliere)) {
            fortune += parseInt(sim.fortuneMobiliere, 10);
          }
        fortune -= franchiseFortune[menageRDU];
        fortune = Math.max(fortune, 0);
        return fortune * tauxMajoration;
      };

    let rdu = 0;
    if (angular.isDefined(sim.revenuNetImposable)) {
        rdu += parseInt(sim.revenuNetImposable, 10);
      }
    if (angular.isDefined(sim.rentePrevoyancePrivee)) {
        rdu += parseInt(sim.rentePrevoyancePrivee, 10);
      }
    if (angular.isDefined(sim.fraisAccessoiresLogement)) {
        rdu -= parseInt(sim.fraisAccessoiresLogement, 10);
      }
    // const nbEnfants = nombreEnfants(sim);
    // rdu -= reductionEnfants(nbEnfants);
    rdu += imputationFortune(sim);
    return rdu;
  }

}

export default CalculRDU;
