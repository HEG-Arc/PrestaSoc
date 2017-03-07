class FooterController {
  /** @ngInject */
  constructor(COMMIT_HASH) {
    this.COMMIT_HASH = COMMIT_HASH;
  }
}

export const footer = {
  template: require('./footer.html'),
  controller: FooterController
};
