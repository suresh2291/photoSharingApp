import React from 'react'
import { useRef, useState } from "react";
import "./style.css";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import AddToYourPost from "./AddToYourPost";
import useClickOutside from "../../helpers/clickOutside";
import { createPost } from "../../functions/post";
import { Vortex } from 'react-loader-spinner'
import PostError from "./PostError";
import UploadImages from './UploadImages';

export default function CreatePostPopup({ user, setPostVisible, posts, dispatch, profile }) {
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [background, setBackground] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useClickOutside(popup, () => {
    setPostVisible(false);
  });

  const postSubmit = async () => {
    if (background) {
      setLoading(true);
      const response = await createPost(
        null,
        background,
        text,
        null,
        user?.id,
        user?.token
      );
      setLoading(false);
      if (response.status === "ok") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [response.data, ...posts],
        });
          setBackground("");
          setText("");
          setPostVisible(false);
      } else {
        setError(response);
      }
    } else if (images && images.length ) {
      setLoading(true);
      const flatUrls = images.flat();
      
      if( images.length>0){
        const response = await createPost(
          null,
          null,
          text,
          flatUrls,
          user?.id,
          user?.token
        );
        setLoading(false);
        if (response.status === "ok") {
          dispatch({
            type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
            payload: [response.data, ...posts],
          });
            setText("");
            setImages("");
            setPostVisible(false);
        } else {
          setError(response);
        }
      }else {
        setError(images.data.message);
      }
      
    } else if (text) {
      setLoading(true);
      const response = await createPost(
        null,
        null,
        text,
        null,
        user?.id,
        user?.token
      );
      setLoading(false);
      if (response.status === "ok") {
        dispatch({
          type: profile ? "PROFILE_POSTS" : "POSTS_SUCCESS",
          payload: [response.data, ...posts],
        });
          setBackground("");
          setText("");
          setPostVisible(false);
      } else {
        setError(response);
      }
   }
  };
  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setPostVisible(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Create Post</span>
        </div>
        <div className="box_profile">
          <img src={user?.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user?.firstName} {user?.lastName}
            </div>
            {/* <div className="box_privacy">
              <img src="../../../icons/public.png" alt="" />
              <span>Public</span>
              <i className="arrowDown_icon"></i>
            </div> */}
          </div>
        </div>

        {!showPrev ? (
          <>
            <EmojiPickerBackgrounds
              text={text}
              user={user}
              setText={setText}
              showPrev={showPrev}
              setBackground={setBackground}
              background={background}
            />
          </>
        ) : (
          <>
          <UploadImages
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setUploadedImages={setUploadedImages}
            setError={setError}
            setPostVisible={setPostVisible}
          />
          </>
        )}
        
        <AddToYourPost setShowPrev={setShowPrev} />
        <button
          className="post_submit"
          onClick={() => {
            postSubmit();
          }}
          disabled={loading}
        >
          {loading ? (
            <Vortex
            visible={true}
            height="50"
            width="50"
            ariaLabel="vortex-loading"
            wrapperStyle={{}}
            wrapperClass="vortex-wrapper"
            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
          />
          ) : (
            "Post"
          )}
        </button>
        
      </div>
    </div>
  );
}
