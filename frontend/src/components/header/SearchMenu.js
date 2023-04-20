import { useEffect, useReducer, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import { Return, Search } from "../../svg";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import { ColorRing } from "react-loader-spinner";
import { Link, Navigate } from "react-router-dom";
import { serverConfig } from "../../configs";
import axios from "axios";
import { photosReducer } from "../../functions/reducers";

export default function SearchMenu({ color, setShowSearchMenu, token, username }) {
  const [searchIconVisible, setSearchIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const menu = useRef(null);
  const removeUser = useRef(null);
  const input = useRef(null);

  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });

  useEffect(() => {
    input.current.focus();
    fetchSearchHistory();
  }, []);

  const [{ photoLoading, photoError, photos }, photoDispatch] = useReducer(photosReducer, {
    photoLoading: false,
    photos: {},
    photoError: "",
  });
  const path = `${username}/*`;
  const max = 30;
  const sort = "desc";
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
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(images.data)
        photoDispatch({ type: "PHOTOS_SUCCESS", payload: images.data });
    } catch (error) {
      photoDispatch({ type: "PHOTOS_ERROR", payload:error.response.data.message, });
    }
  };


  const debounceTimeout = useRef(null);
  const fetchSearchHistory = async () => {
    try {
      const response = await getSearchHistory(token);
      setSearchHistory(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setLoading(true);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await search(term, token);
        setSearchResults(response);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // const addToSearchHistoryHandler = async (searchUser) => {
  //    addToSearchHistory(searchUser, token);
  //   fetchSearchHistory();
    
  // };
  
  // const handleRemove = async (searchUser) => {
  //   removeFromSearch(searchUser, token);
  //   fetchSearchHistory();
  // };
  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => {
              setShowSearchMenu(false);
            }}
          >
            <Return color={color} />
          </div>
        </div>
        <div
          className="search"
          onClick={() => {
            input.current.focus();
          }}
        >
          {searchIconVisible && (
            <div>
              <Search color={color} />
            </div>
          )}
          <input
            type="text"
            placeholder="Search PhotoAnnomate"
            ref={input}
            onFocus={() => {
              setSearchIconVisible(false);
            }}
            onBlur={() => {
              setSearchIconVisible(true);
            }}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      {/* <div className="search_history_header">
        <span> Recent Searches</span>
      </div> */}
      {/* <div className="search_history">
        {loading ? (
          <div className="sekelton_loader">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        ) : (
          <div>
            {searchHistory &&
              searchHistory.map((res, index) => (
                <div className="search_user_item hover1" key={index}>
                  <Link to={`/profile/${res?.user?.userName}`} key={index}>
                    <img src={res?.user?.avatar} alt="" />
                    <span>
                      {res?.user?.firstName} {res?.user?.lastName}
                    </span>
                  </Link>
                  <i
                    className="exit_icon small_circle"
                    onClick={() => {
                      handleRemove(res?.user?._id);
                    }}
                  ></i>
                </div>
              ))}
          </div>
        )}
      </div> */}
      <div className="search_border"></div>
      <div className="search_results scrollbar">
        {loading ? (
          <div className="sekelton_loader">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        ) : (
          <div>
            {searchResults &&
              searchResults.map((user) => (
                <Link 
                  to={`/profile/${user?.userName}`}
                  className="search_user_item hover1"
                  //onClick={() =>  getData()}
                  key={user?._id}
                >
                  <img src={user?.avatar} alt="" />
                  <span>
                    {user?.firstName} {user?.lastName}
                  </span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
