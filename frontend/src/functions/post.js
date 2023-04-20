import axios from "axios";
import { serverConfig } from "../configs";
export const createPost = async (
  type,
  background,
  text,
  images,
  user,
  token
) => {
  try {
    const { data } = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/create`,
      {
        type,
        background,
        text,
        images,
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: "ok", data };
  } catch (error) {
    return error.response.data.message;
  }
};

export const getPosts = async (
  token
) => {
  try {
    const { data } = await axios.get(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const reactPost = async (postId, react, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/put_reacts`,
      {
        postId,
        react,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};

export const getReacts = async (postId, token) => {
  try {
    const { data } = await axios.get(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/get_reacts/${postId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const savePost = async (postId, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/save_post?id=${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const deletePost = async (postId, token) => {
  try {
    const { data } = await axios.delete(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/delete_post?id=${postId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const comment = async (postId, comment, image, token) => {
  try {
    const { data } = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.post}/comments`,
      {
        postId,
        comment,
        image,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};