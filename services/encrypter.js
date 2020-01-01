const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
let key;
let randomString = function(length){return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length); };
const iv = crypto.randomBytes(16);

module.exports.encrypt = (text) =>{
  key = randomString(16);
  let cipher = crypto.createCipher(algorithm, key, iv);
  let crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex')+"-"+key;
  console.log(crypted);
  console.log(crypted.split("-").pop());
  console.log(key);
  console.log(crypted.substring(0, crypted.indexOf('-')));
  return crypted;
}

module.exports.decrypt = (text) =>{
  let key2 = text.split("-").pop();
  let text2 = text.substring(0, text.indexOf('-'));
  let decipher = crypto.createDecipher(algorithm, key2, iv);
  let dec = decipher.update(text2,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}
