const loaderUtils = require("loader-utils");
const request = require('request');

function queueDownload(promiseChain, url) {
  return promiseChain.then(content => {
    return new Promise((resolve, reject) => {
      request(url, (err, res, fileContent) => {
        if (err) {
          this.emitError(err);
          reject(err);
        }
        console.log(`Fetch and replace: ${url}`);
        const path = loaderUtils.interpolateName(this, './app/services/[hash].json', {content: fileContent});
        this.emitFile(path, fileContent);
        content = content.replace(url, path);
        resolve(content);
      });
    });
  });
}

module.exports = function (content) {
  if (!this.emitFile) {
    throw new Error("emitFile is required from module system");
  }
  const callback = this.async();

  const regex = /https:\/\/script.google.com.*?exec/g;
  let promiseChain = Promise.resolve(content);
  let m;

  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    promiseChain = queueDownload.bind(this)(promiseChain, m[0]);
  }

  promiseChain.then(content => {
    callback(null, content);
  });
};
