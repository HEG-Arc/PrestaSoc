class FortuneController {
  constructor() {
    this.text = 'fortune';
  }
}

export const fortune = {
  template: require('./fortune.html'),
  controller: FortuneController
};

