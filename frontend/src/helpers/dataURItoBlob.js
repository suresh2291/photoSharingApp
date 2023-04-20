// export default function dataURItoBlob(dataURI) {
//   // convert base64/URLEncoded data component to raw binary data held in a string
//   var byteString;
//   if (dataURI.split(",")[0].indexOf("base64") >= 0)
//     byteString = atob(dataURI.split(",")[1]);
//   else byteString = unescape(dataURI.split(",")[1]);

//   // separate out the mime component
//   var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

//   // write the bytes of the string to a typed array
//   var ia = new Uint8Array(byteString.length);
//   for (var i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }

//   return new Blob([ia], { type: mimeString });
// }

// export function dataURItoBlob(dataURI, type) {
//   // convert base64/URLEncoded data component to raw binary data held in a string
//   let byteString;
//   if (dataURI.split(",")[0].indexOf("base64") >= 0)
//     byteString = atob(dataURI.split(",")[1]);
//   else byteString = unescape(dataURI.split(",")[1]);

//   // separate out the mime component
//   let mimeString = type;

//   // write the bytes of the string to a typed array
//   let ia = new Uint8Array(byteString.length);
//   for (var i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }

//   // generate a unique filename
//   let filename = "image-" + Date.now() + "." + mimeString.split("/")[1];

//   return { blob: new Blob([ia])};
// }

export function createBlobFromBase64(base64Data) {
const contentType = base64Data.split(";")[0].split(":")[1];
const binaryData = atob(base64Data.split(",")[1]);

// Create a blob from the binary data
const blob = new Blob([binaryData], { type: contentType });

// Generate a unique filename using the current timestamp
const timestamp = new Date().getTime();
const filename = `postImages-${timestamp}.${contentType.split("/")[1]}`;

// Create a file object from the blob with the unique filename
const file = new File([blob], filename, { type: contentType });
return file
}




