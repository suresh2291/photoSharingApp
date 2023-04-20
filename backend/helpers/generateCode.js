const crypto = require('crypto');

/**
 let code = '';
while (code.length < 5) {
  const randomBytes = crypto.randomBytes(2);
  const randomInt = randomBytes.readUInt16LE(0);
  const randomDigit = randomInt % 10;
  if (code.length === 0 && randomDigit === 0) {
    continue;
  }
  code += randomDigit.toString();
}
return code;
 */
function generateCode(num) {
  let code = '';
while (code.length < num) {
  const randomBytes = crypto.randomBytes(2);
  const randomInt = randomBytes.readUInt16LE(0);
  const randomDigit = randomInt % 10;
  if (code.length === 0 && randomDigit === 0) {
    continue;
  }
  code += randomDigit.toString();
}
return code;
}

module.exports = generateCode;