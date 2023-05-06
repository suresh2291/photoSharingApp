/**
 * This components is responsible for showing the friends page in home middle.
 * It has left and right, where in left side will show the menu and right side will show the requested friends, sent requests and friends.
 */
import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import { friendspage, postsReducer } from "../../functions/reducers";
import { getFriendsPageInfos } from "../../functions/user";
import Card from "./Card";
import "./style.css";
import { Link, useParams } from "react-router-dom";
import { getPosts } from "../../functions/post";
export default function Friends() {
  const { user } = useSelector((state) => ({ ...state }));
  const { type } = useParams();
  const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
    loading: false,
    data: {},
    error: "",
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    dispatch({ type: "FRIENDS_REQUEST" });
    const data = await getFriendsPageInfos(user.token);
    if (data.status === "ok") {
      dispatch({ type: "FRIENDS_SUCCESS", payload: data.data });
    } else {
      dispatch({ type: "FRIENDS_ERROR", payload: data.data });
    }
  };

  const [{ postLoading, posts, postError }, postDispatch] = useReducer(postsReducer, {
    postLoading: false,
    posts: [],
    postError: "",
  });
  
  useEffect(() => {
    getAllPosts()
      .then(result => {
        if (result?.success) {
          postDispatch({
            type: "POSTS_SUCCESS",
            payload: result?.data,
          });
        } else {
          postDispatch({
            type: "POSTS_ERROR",
            payload: result?.error,
          });
        }
      })
      .catch(error => {
        postDispatch({
          type: "POSTS_ERROR",
          payload: error?.response?.data.message,
        });
      });
  }, []);
  
  const getAllPosts = async () => {
    try {
      postDispatch({
        type: "POSTS_REQUEST",
      });
      const { data } = await getPosts(user?.token);
      return { success: true, data };
    } catch (error) {
      return { success: false, postError: error?.response?.data.message };
    }
  };

  return (
    <>
      <Header page="friends" getAllPosts={getAllPosts}/>
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
          </div>
          <div className="friends_left_wrap">
            <Link
              to="/friends"
              className={`user_menu_item hover3 ${
                type === undefined && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_home_icon "></i>
              </div>
              <span>Home</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/requests"
              className={`user_menu_item hover3 ${
                type === "requests" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Friend Requests</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <Link
              to="/friends/sent"
              className={`user_menu_item hover3 ${
                type === "sent" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="friends_requests_icon"></i>
              </div>
              <span>Sent Requests</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <div className="user_menu_item hover3">
              <div className="small_circle">
                <i className="friends_suggestions_icon"></i>
              </div>
              <span>Suggestions</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <Link
              to="/friends/all"
              className={`user_menu_item hover3 ${
                type === "all" && "active_friends"
              }`}
            >
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>All Friends</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </Link>
            <div className="user_menu_item hover3">
              <div className="small_circle">
                <i className="birthdays_icon"></i>
              </div>
              <span>Birthdays</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="user_menu_item hover3">
              <div className="small_circle">
                <i className="all_friends_icon"></i>
              </div>
              <span>Custom Lists</span>
              <div className="rightArrow">
                <i className="right_icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="friends_right">
          {(type === undefined || type === "requests") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friend Requests</h3>
                {type === undefined && (
                  <Link to="/friends/requests" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.requests &&
                  data.requests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="request"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "sent") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Sent Requests</h3>
                {type === undefined && (
                  <Link to="/friends/sent" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.sentRequests &&
                  data.sentRequests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="sent"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "all") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friends</h3>
                {type === undefined && (
                  <Link to="/friends/all" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.friends &&
                  data.friends.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="friends"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
