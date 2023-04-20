import axios from "axios";
import { serverConfig } from "../configs";

const uploadImages = async (formData, path, userId, filename,profilepic, coverpic, token) => {
  try {
    const { data } = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.upload}/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

const uploadToCloudinary = async (uri, path, token) => {
  try {
    const { data } = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.upload}/upload/cloudinary`,
      {
        uri,
        path
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export {uploadImages, uploadToCloudinary}