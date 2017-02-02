class NavController {
  constructor() {
    this.text = 'My brand new component!';
  }
}

export const nav = {
  template: require('./nav.html'),
  controller: NavController
};

