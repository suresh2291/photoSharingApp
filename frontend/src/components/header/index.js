import "./style.css";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Friends,
  FriendsActive,
  Home,
  HomeActive,
  Logo,
  Menu,
  Messenger,
  Notifications,
  Photo,
  Search,
} from "../../svg";
import { useSelector } from "react-redux";
import SearchMenu from "./SearchMenu";
import { useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import AllMenu from "./AllMenu";
import UserMenu from "./userMenu";

export default function Header({ page, getAllPosts }) {
  const color = "#65676b";
  const { user } = useSelector((user) => ({ ...user }));
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const allmenu = useRef(null);
  const usermenu = useRef(null);
  useClickOutside(allmenu, () => {
    setShowAllMenu(false);
  });
  useClickOutside(usermenu, () => {
    setShowUserMenu(false);
  });
  return (
    <header>
      <div className="header_left">
        <Link to="/" className="header_logo">
          <div className="logo_circle">
          <img src="https://res.cloudinary.com/deph1hkms/image/upload/v1680255521/palogo-removebg-preview_a3cr3y.png" alt="alt"/>
          </div>
        </Link>
        <div
          className="search search1"
          onClick={() => {
            setShowSearchMenu(true);
          }}
        >
          <Search color={color} />
          <input
            type="text"
            placeholder="Search PhotoAnnomate"
            className="hide_input"
          />
        </div>
      </div>
      {showSearchMenu && (
        <SearchMenu color={color} setShowSearchMenu={setShowSearchMenu} token={user?.token}/>
      )}
      <div className="header_middle">
      <Link
          to="/"
          className={`middle_icon ${page === "home" ? "active" : "hover1"}`}
          onClick={() => getAllPosts()}
        >
          {page === "home" ? <HomeActive /> : <Home color={color} />}
        </Link>
        <Link
          to="/friends"
          className={`middle_icon ${page === "friends" ? "active" : "hover1"}`}
        >
          {page === "friends" ? <FriendsActive /> : <Friends color={color} />}
        </Link>
        <Link
          to="/photos"
          className={`middle_icon ${page === "photos" ? "active" : "hover1"}`}
          style={{"fill":"grey"}}
        >
          {page === "photos" ? <Photo /> : <Photo color={color} />}
        </Link>
      </div>
      <div className="header_right">
      <Link
          to="/profile"
          className={`profile_link hover1 ${
            page === "profile" ? "active_link" : ""
          }`}
        >
          <img src={user?.picture} alt="" />
          <span>{user?.firstName}</span>
        </Link>
        <div className={`circle_icon hover1 ${showAllMenu && "active_header"}`} ref={allmenu}>
          <div
            onClick={() => {
              setShowAllMenu((prev) => !prev);
            }}
          >
            <div style={{transform: "translateY(-1px)"}}>
               <Menu />
            </div>
           
          </div>
           {showAllMenu && <AllMenu />}
        </div>
        <div className="circle_icon hover1">
          <Messenger />
        </div>
        <div className="circle_icon hover1">
          <Notifications />
          <div className="right_notification">10</div>
        </div>
        <div className={`circle_icon hover1 ${showUserMenu && "active_header"}`} ref={usermenu}>
          <div
            onClick={() => {
              setShowUserMenu((prev) => !prev);
            }}
          >
            <ArrowDown />
          </div>
          {showUserMenu && <UserMenu user={user} />}
        </div>
      </div>
    </header>
  );
}
