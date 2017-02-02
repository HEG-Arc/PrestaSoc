class ResultController {
  constructor() {
    this.text = 'Result!';
  }
}

export const result = {
  template: require('./result.html'),
  controller: ResultController
};

