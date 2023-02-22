const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailRegexStrict = /^[^\s@]+@[a-zA-Z-]+\.[a-zA-Z]{2,}$/;
const isValidEmail = emailRegexStrict.test('samplemail12345@gmail.com');
console.log(isValidEmail); // false
