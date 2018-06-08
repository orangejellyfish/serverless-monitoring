// Dont want to deal with external modules for now.
// Will iterate on this.
const https = require('https');

const URL = 'https://www.orangejellyfish.com/';

module.exports.handler = async (event) => {
    
    return new Promise((resolve, reject) =>  {
        https.get(URL, (resp) => {
          let data = '';
         
          resp.on('data', (chunk) => {
            data += chunk;
          });
         
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            if (resp.statusCode !== 200) {
                reject('Some error');
            }
            
            resolve(URL + ' IS available.');
          });
         
        }).on("error", (err) => {
          reject(URL + ' NOT available.');
        });
    });
    
};
