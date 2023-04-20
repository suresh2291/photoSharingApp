import axios from "axios";
import { serverConfig } from "../configs";
export const updateprofilePicture = async (url, token) => {
  try {
    const { data } = await axios.put(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/update_profile_picture`,
      {
        url,
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

export const updateCover = async (url, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/update_cover`,
      {
        url,
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

export const addFriend = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/send_request?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
export const cancelRequest = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/cancel_request?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
export const follow = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/follow?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    console.log(data);
    return "ok";
  } catch (error) {
    console.log(error.response.data.message);
    return error.response.data.message;
  }
};
export const unfollow = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/unfollow?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
export const acceptRequest = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/accept_request?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
export const unfriend = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/unfriend?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};
export const deleteRequest = async (id, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/delete_request?id=${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};

export const search = async (searchTerm, token) => {
    try {
      const { data } = await axios.post(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/search?user=${searchTerm}`,
        {},
  
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
}
export const addToSearchHistory = async (searchUser, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/search_history`,
      { searchUser },

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
};;

export const getSearchHistory = async (token) => {
  try {
    const { data } = await axios.get(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/get_search_history`,

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

export const removeFromSearch = async (searchUser, token) => {
  try {
    const { data } = await axios.put(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/remove_search`,
      { searchUser },

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

export const getFriendsPageInfos = async (token) => {
  try {
    const { data } = await axios.get(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/get_friends_list`,

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