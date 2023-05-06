// This code imports the built-in "crypto" module for generating secure random numbers and strings.
const crypto = require('crypto');

// The following function generates a random string with "num" number of digits.
function generateCode(num) {
  let code = '';
  
  // Here we use a loop to keep adding random digits until "code" has required length.
  while (code.length < num) {
      
    // The following code generates cryptographically strong random bytes of length 2 using the "randomBytes" method of the crypto module.
    const randomBytes = crypto.randomBytes(2);
    
    // We then convert the 2 bytes into an unsigned 16-bit integer using the "readUInt16LE" method of the buffer object.
    const randomInt = randomBytes.readUInt16LE(0);

    // We then get a random digit out of the above-generated integer by taking its mod with 10.
    const randomDigit = randomInt % 10;
    
    // If the generated digit is 0 and "code" is empty, we skip this iteration and generate a new digit. This is because if the first digit is 0, the resulting number will have lesser digits than expected due to leading zeros being ignored.
    if (code.length === 0 && randomDigit === 0) {
      continue;
    }
    
    // We append the generated digit to the "code" string.
    code += randomDigit.toString();
  }
  
  // Finally, we return the generated code.
  return code;
}

// This exports the "generateCode" function so any other module can import it and use it to generate random codes.
module.exports = generateCode;
