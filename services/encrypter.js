const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'd6F3Efeq';
const iv = crypto.randomBytes(16);

module.exports.encrypt = (text) =>{
  var cipher = crypto.createCipher(algorithm, key, iv)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

module.exports.decrypt = (text) =>{
  var decipher = crypto.createDecipher(algorithm, key, iv)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}




//var hw = encrypt("Some serious stuff")
//console.log(hw)
//console.log(decrypt(hw))
