const crypto = require('crypto')
const algorithm = 'aes-256-ctr',
const password = 'posistTest';
const hash = crypto.createHash('sha256');

exports.encryptValue = (text) => {
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');

  return crypted;
}
 
exports.decryptValue = (text) => {
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.hashValue = (data) => {
  return hash.update(data);
}
