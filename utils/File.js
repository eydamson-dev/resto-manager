'use strict';
const fs = require('fs');

class File {
  static readJSONFile(path) {
    let promise = new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.log(`Error reading file from disk: ${err}`);
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });

    return promise;
  }
}

module.exports = File;

