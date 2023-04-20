import "./style.css";
import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/header";
import CreatePost from "../../components/home/createPost";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Post from "../../components/post";
import { getPosts } from "../../functions/post";
import CreatePostPopup from "../../components/createPostPopup";
import { Blocks } from "react-loader-spinner";
import { postsReducer } from "../../functions/reducers";

export default function Home({ setPostVisible, postVisible }) {
  const { user } = useSelector((state) => ({ ...state }));
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
    <Row style={{ minWidth: "1200px" }}>
      {postVisible && user && (
        <CreatePostPopup
          user={user}
          setPostVisible={setPostVisible}
          posts={posts}
          dispatch={dispatch}
        />
      )}
      <Header page="home" getAllPosts={getAllPosts} />
      <Col xs={12} md={3}>
        <LeftHome user={user} />
      </Col>
      <Col xs={12} md={6}>
        <div className="home_middle">
          {/* {!user?.verified && <ResendVerification user={user} />} */}
          <CreatePost user={user} setPostVisible={setPostVisible} />
          {postLoading ? (
            <div className="sekelton_loader">
              <Blocks
                visible={true}
                height="90"
                width="90"
                ariaLabel="blocks-loading"
                wrapperStyle={{"position":"absolute", "marginTop":"120px"}}
                wrapperClass="blocks-wrapper"
              />
            </div>
          ) : (
            <div>
              {posts && posts.length ? (posts.map((post, i) => (
                <Post key={i} post={post} user={user} />
              ))
              ): (<div className="no_posts">Your first post is the start of something great. Click on "What's on your mind, {user?.firstName}?" and create your first post.</div>)}
            </div>
          )}
        </div>
      </Col>
      <Col xs={12} md={3}>
        <RightHome user={user} />
      </Col>
    </Row>
  );
}
