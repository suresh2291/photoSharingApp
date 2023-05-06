/**
 * This module file is used forhandling images in the cloudinary.
 */
const sharp = require("sharp");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const Images = require("../db/schemas/imagesModel");
const User = require("../db/schemas/userModel");
const cloudinary = require("cloudinary");
const { serverConfig } = require("../configs/index");
const fastq = require("fastq");

cloudinary.config({
  cloud_name: `${serverConfig.cloudinary.name}`,
  api_key: `${serverConfig.cloudinary.apiKey}`,
  api_secret: `${serverConfig.cloudinary.apiSecret}`,
  hide_sensitive: true,
  secure: true,
  cdn_subdomain: true,
});
/**
 *This is used for compressing the images using sharp.
 * compressImages, which accepts three parameters: path, destination, and filename. 
 * The function uses the Sharp package to resize and compress an image before saving it to a destination folder with a new filename.
 * 
 * The options passed to the .resize() method are:
 * fit: "inside": This option tells Sharp to scale the image to fit within the given dimensions (1024x600), but not to exceed them.
 * withoutEnlargement: true: This option prevents Sharp from enlarging the image if its original dimensions are already smaller than the target dimensions.
 * fastShrinkOnLoad: true: This option enables fast shrinking of images using the JPEG shrink-on-load technique, which can improve performance.
 */
async function compressImages(path, destination, filename){
  return await sharp(path)
          .resize(1024, 600, {
            fit: "inside",
            withoutEnlargement: true,
            fastShrinkOnLoad: true,
          })
          .jpeg({ quality: 90 })
          .toFile(destination + filename);
}

async function compressFiles(files, userId, filename, profilepic, coverpic) {
  const compressedFiles = [];
  const limit = fastq.promise(async (file) => {
    try {
      let data;
      let compressedFile; coverpic
      // Compress the file using sharp 
      if (filename) {
        await compressImages(file.path, file.destination,`\\annotate_${file.filename}`)
      }else if(profilepic){
        await compressImages(file.path, file.destination,`\\profile_${file.filename}`)
      }else if(coverpic){
        await compressImages(file.path, file.destination,`\\cover_${file.filename}`)
      }else {
        await compressImages(file.path, file.destination,`\\cmprs_${file.filename}`);
      }

      // Read the compressed file as stream
      if (filename) {
        data = await fs.promises.readFile(
          file.destination + `\\annotate_${file.filename}`
        );
      } else if(profilepic){
        data = await fs.promises.readFile(
          file.destination + `\\profile_${file.filename}`
        );
      }else if(coverpic){
        data = await fs.promises.readFile(
          file.destination + `\\cover_${file.filename}`
        );
      }else {
        data = await fs.promises.readFile(
          file.destination + `\\cmprs_${file.filename}`
        );
      }
//create a common object for string the image files data into DB.
      let commonObject = {
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        backup: true,
        destination: file.destination,
        size: data.length,
        userId: userId,
      }

/**
 * this below code helps to create aa unique filename and upload to cloudinary.
 * we use publicId field when uploading to cloudinary.
 */
      if (filename) {
        compressedFile = {
          ...commonObject,
          filename: `annotate_${file.filename}`,
          path: file.destination + `\\annotate_${file.filename}`,
          publicId: `annotate_${file.filename.split(".")[0]}`,
        };
      }else if(profilepic){
        compressedFile = {
          ...commonObject,
          filename: `profile_${file.filename}`,
          path: file.destination + `\\profile_${file.filename}`,
          publicId: `profile_${file.filename.split(".")[0]}`,
        };
      }else if(coverpic){
        compressedFile = {
          ...commonObject,
          filename: `cover_${file.filename}`,
          path: file.destination + `\\cover_${file.filename}`,
          publicId: `cover_${file.filename.split(".")[0]}`,
        };
      }else {
        compressedFile = {
          ...commonObject,
          filename: `cmprs_${file.filename}`,
          path: file.destination + `\\cmprs_${file.filename}`,
          publicId: `cmprs_${file.filename.split(".")[0]}`,
        };
      }

      await fs.promises.unlink(file.path);

      // Add the compressed file object to the compressedFiles array
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(`Error compressing file ${file.originalname}: ${error}`);
    }
  }, 10); // limit to 10 concurrent jobs

  // Queue the image compression jobs
  for (const file of files) {
    await limit.push(file);
  }

  // Wait for all jobs to finish
  await limit.drain();

  return compressedFiles;
}

/**
 * This function is used for uploading files to cloudinary.Will pass the compressedFiles object which we have created in the above function and username path.
 * This path will create a directory under the username, which helps us for storing images, profilepic, coverpic in the cloudinary. 
 */
async function uploadFiles(files, path) {
  try {
    const uploadPromises = files.map(
      async (file) => {
        const uploadResult = await cloudinary.v2.uploader.upload(file.path, {
          folder: path,
          public_id: file.publicId,
          overwrite: true,//if the user upload the same file it would overwrite which avoids duplication.
        });
        return { ...file, url: uploadResult.url, secure_url: uploadResult.secure_url };
      },
      { concurrent: 5 }//will be uploading 5 images at a time, instead of uploading all the images.
    ); // set the concurrent option to 5

    const uploadResults = await Promise.all(uploadPromises);
    const cloudinaryUrls = uploadResults.map((result) => ({
      url: result.secure_url,
    }));
    // Delete uploaded files in a single batch
    const deletePromises = files.map((file) => fs.promises.unlink(file.path));
    await Promise.all(deletePromises);
    return { cloudUrl: cloudinaryUrls, insertDB: uploadResults };
  } catch (error) {
    console.error(`Failed to upload file:`);
    console.error(error.error);
  }
}

async function uploadToCloudinary(uri, path) {
  try {
    const publicId = uri.substring(uri.lastIndexOf("/") + 1);
    const uploadResult = await cloudinary.v2.uploader.upload(uri, {
      folder: path,
      public_id: publicId,
      overwrite: true,
    });
    return { url: uploadResult.secure_url };
  } catch (error) {
    console.error(`Failed to upload file:`);
    console.error(error);
  }
}

//This functions help to retrive all the images of the user.
async function cloudinaryProfileImages(path, sort, max) {
  const result = await cloudinary.v2.search
    .expression(`${path}`)
    .sort_by("created_at", `${sort}`)
    .max_results(max)
    .execute()

    return result;
}
//This will insert the images into the DB. The uploadFiles() we return the result insertDB, which helps in inserting into DB. 
async function insertIntoDB(insertImages) {
  const promises = insertImages.map((doc) => {
    return Images.findOneAndUpdate({ filename: doc.filename }, doc, {
      upsert: true,
    });
  });

  Promise.all(promises).catch((error) => {
    console.error("Error inserting/updating documents:", error);
  });
}

module.exports = {
  compressFiles,
  uploadToCloudinary,
  insertIntoDB,
  uploadFiles,
  cloudinaryProfileImages
};
