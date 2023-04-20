import { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import { photosReducer, postsReducer } from "../../functions/reducers";
import "./style.css";
import { Link, useParams } from "react-router-dom";
import { serverConfig } from "../../configs";
import axios from "axios";
import Display from "./Display";
import { getPosts } from "../../functions/post";

export default function Photos() {
  const { user } = useSelector((state) => ({ ...state }));
  const [photos, setPhotos] = useState({});
  const path = `${user.userName}/*`;
  const max = 30;
  const sort = "desc";
  const [{ photoLoading, photoError, data }, photoDispatch] = useReducer(photosReducer, {
    photoLoading: false,
    data: {},
    photoError: "",
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    photoDispatch({ type: "PHOTOS_REQUEST" });
    const images = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.profile}/profile_images`,
      { path, sort, max },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (images.data) {
      setPhotos(images.data);
      photoDispatch({ type: "PHOTOS_SUCCESS", payload: images.data });
    } else {
      photoDispatch({ type: "PHOTOS_ERROR", payload: images.data });
    }
  };


  const [{ postLoading, posts, error }, dispatch] = useReducer(postsReducer, {
    postLoading: false,
    posts: [],
    error: "",
  });
  
  useEffect(() => {
    getAllPosts()
      .then(result => {
        if (result?.success) {
          dispatch({
            type: "POSTS_SUCCESS",
            payload: result?.data,
          });
        } else {
          dispatch({
            type: "POSTS_ERROR",
            payload: result?.error,
          });
        }
      })
      .catch(error => {
        dispatch({
          type: "POSTS_ERROR",
          payload: error?.response?.data.message,
        });
      });
  }, []);
  
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await getPosts(user?.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error?.response?.data.message };
    }
  };
  return (
    <>
      <Header page="photos" getAllPosts={getAllPosts}/>
      <div >
        {photos && photos ? <Display photos={photos} user={user} photoLoading={photoLoading} /> :  <div className="no_posts">No photos available</div>}
      </div>
    </>
  );
}
