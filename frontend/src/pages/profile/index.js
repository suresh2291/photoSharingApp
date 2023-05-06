import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { photosReducer, postsReducer, profileReducer } from "../../functions/reducers";
import axios from "axios";
import { serverConfig } from "../../configs";
import { Container, Row, Col } from "react-bootstrap";
import "./style.css";
import Header from "../../components/header";
import Cover from "./Cover";
import ProfielPictureInfos from "./ProfielPictureInfos";
import ProfileMenu from "./ProfileMenu";
import PplYouMayKnow from "./PplYouMayKnow";
import CreatePost from "../../components/home/createPost";
import GridPosts from "./GridPosts";
import Post from "../../components/post";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/intro";
import { useMediaQuery } from "react-responsive";
import CreatePostPopup from "../../components/createPostPopup";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Blocks } from "react-loader-spinner";
import { getPosts } from "../../functions/post";
import Chat from "../../components/home/chat";

export default function Profile({}) {
  const [postVisible, setPostVisible] = useState(false);
  const { userName } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => ({ ...state }));
  var username = userName === undefined ? user?.userName : userName;

  const [{ postLoading, posterror, posts }, dispatchPost] = useReducer(postsReducer, {
    postLoading: false,
    posts: [],
    posterror: "",
  });
  useEffect(() => {
    getAllPosts()
      .then(result => {
        if (result.success) {
          dispatchPost({
            type: "POSTS_SUCCESS",
            payload: result.data,
          });
        } else {
          dispatchPost({
            type: "POSTS_ERROR",
            payload: result.error,
          });
        }
      })
      .catch(error => {
        dispatchPost({
          type: "POSTS_ERROR",
          payload: error.response?.data.message,
        });
      });
  },[]);
  
  const getAllPosts = async () => {
    try {
      dispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await getPosts(user?.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data.message };
    }
  };
  const [{ profileLoading, profileError, profile }, dispatch] = useReducer(profileReducer, {
    profileLoading: false,
    profile: {},
    profileError: "",
  });
  useEffect(() => {
    getProfile();
  }, [username]);

  let visitor = username === user?.userName ? false : true;

  const path = `${username}/*`;
  const max = 30;
  const sort = "desc";
  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });
      const { data } = await axios.get(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.profile}/user_profile?username=${username}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (data.ok === false) {
        navigate("/profile");
      }
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  const [{ photoLoading, photoError, photos }, photoDispatch] = useReducer(photosReducer, {
    photoLoading: false,
    photos: {},
    photoError: "",
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
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
      photoDispatch({ type: "PHOTOS_SUCCESS", payload: images.data });
    } catch (error) {
      photoDispatch({ type: "PHOTOS_ERROR", payload:error.response.data.message, });
    }
  };

  const profileTop = useRef(null);
  const leftSide = useRef(null);
  const [height, setHeight] = useState();
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 200);
    setLeftHeight(leftSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [profileLoading, scrollHeight]);
  const check = useMediaQuery({
    query: "(min-width:901px)",
  });
  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };
  return (
    <div className="profile">
      {postVisible && (
        <CreatePostPopup
          user={user}
          setPostVisible={setPostVisible}
          posts={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}
      <Header page="profile"  getAllPosts={getAllPosts}/>
      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          {profileLoading ? (
            <>
              <div className="profile_cover">
                <Skeleton
                  height="347px"
                  containerClassName="avatar-skeleton"
                  style={{ borderRadius: "8px" }}
                />
              </div>
              <div
                className="profile_img_wrap"
                style={{
                  marginBottom: "-3rem",
                  transform: "translateY(-8px)",
                }}
              >
                <div className="profile_w_left">
                  <Skeleton
                    circle
                    height="180px"
                    width="180px"
                    containerClassName="avatar-skeleton"
                    style={{ transform: "translateY(-3.3rem)" }}
                  />
                  <div className="profile_w_col">
                    <div className="profile_name">
                      <Skeleton
                        height="35px"
                        width="200px"
                        containerClassName="avatar-skeleton"
                      />
                    </div>
                    <div className="profile_friend_count">
                      <Skeleton
                        height="20px"
                        width="90px"
                        containerClassName="avatar-skeleton"
                        style={{ marginTop: "5px" }}
                      />
                    </div>
                    <div className="profile_friend_imgs">
                      {Array.from(new Array(6), (val, i) => i + 1).map(
                        (id, i) => (
                          <Skeleton
                            key={i}
                            circle
                            height="32px"
                            width="32px"
                            containerClassName="avatar-skeleton"
                            style={{ transform: `translateX(${-i * 7}px)` }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={`friendship ${!visitor && "fix"}`}>
                  <Skeleton
                    height="36px"
                    width={120}
                    containerClassName="avatar-skeleton"
                  />
                  <div className="flex">
                    {visitor && (
                      <>
                        <Skeleton
                          height="36px"
                          width={120}
                          containerClassName="avatar-skeleton"
                        />

                        <Skeleton
                          height="36px"
                          width={120}
                          containerClassName="avatar-skeleton"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Cover
                cover={profile?.cover}
                visitor={visitor}
                photos={photos?.resources}
                getProfile={getProfile}
              />
              <ProfielPictureInfos
                profile={profile}
                visitor={visitor}
                photos={photos?.resources}
                profileLoading={profileLoading}
                getProfile={getProfile}
              />
            </>
          )}

          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            {/* <PplYouMayKnow /> */}
            <div
              className={`profile_grid ${
                check && scrollHeight >= height && leftHeight > 1000
                  ? "scrollFixed showLess"
                  : check &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                {profileLoading ? (
                  <>
                    <div className="profile_card">
                      <div className="profile_card_header">Intro</div>
                      <div className="sekelton_loader">
                        <Blocks
                          visible={true}
                          height="90"
                          width="90"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                        />
                      </div>
                    </div>
                    {/* <div className="profile_card">
                      <div className="profile_card_header">
                        Photos
                        <div className="profile_header_link">
                          See all photos
                        </div>
                      </div>
                      <div className="sekelton_loader">
                        <Blocks
                          visible={true}
                          height="90"
                          width="90"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                        />
                      </div>
                    </div> */}
                    <div className="profile_card">
                      <div className="profile_card_header">
                        Friends
                        <div className="profile_header_link">
                          See all friends
                        </div>
                      </div>
                      <div className="sekelton_loader">
                        <Blocks
                          visible={true}
                          height="90"
                          width="90"
                          ariaLabel="blocks-loading"
                          wrapperStyle={{}}
                          wrapperClass="blocks-wrapper"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Intro
                      detailss={profile.details}
                      visitor={visitor}
                    />
                    {/* <Photos
                      username={userName}
                      token={user.token}
                      photos={photos}
                    /> */}
                    <Friends friends={profile.friends} />
                  </>
                )}
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} setPostVisible={setPostVisible} />
                )}
                <GridPosts />
                {profileLoading ? (
                  <div className="sekelton_loader">
                    <Blocks
                      visible={true}
                      height="90"
                      width="90"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                    />
                  </div>
                ) : (
                  <div>
                    {profile.posts && profile.posts.length ? (
                      profile.posts.map((post) => (
                        <Post post={post} user={user} key={post._id} profile />
                      ))
                    ) : (
                      <div className="no_posts">Your first post is the start of something great. Click on "What's on your mind, {user?.firstName}?" and create your first post.</div>
                    )}
                  </div>
                )}
                <Chat user={user}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
