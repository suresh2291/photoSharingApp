/**
 * The components are responsible for rendering the user menu shown in right header where logout would display.
 */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import DisplayAccessibility from "./DisplayAccessibility";
import HelpSupport from "./HelpSupport";
import SettingsPrivacy from "./SettingsPrivacy";
import Cookies from "js-cookie";
export default function UserMenu({user}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const logout = ()=>{
    Cookies.set("user","")
    dispatch({
      type: "LOGOUT"
    })
    navigate('/login')
  }
  return (
    <div className="user_menu">
      {visible === 0 && (
        <div>
          <Link to="/profile" className="user_menu_header hover3">
            <img src={user?.picture} alt="" />
            <div className="user_menu_col">
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              <span>See your Profile</span>
            </div>
          </Link>
          <div className="user_menu_splitter"></div>
          <div className="user_menu_main hover3">
            <div className="small_circle">
              <i className="report_filled_icon"></i>
            </div>
            <div className="user_menu_col">
              <div className="user_menu_span1">Give Feedback</div>
              <div className="user_menu_span2">Help us improve App</div>
            </div>
          </div>
          <div className="user_menu_splitter"></div>
          <div
            className="user_menu_item hover3"
            onClick={() => {
              setVisible(1);
            }}
          >
            <div className="small_circle">
              <i className="settings_filled_icon"></i>
            </div>
            <span>Settings & Privacy</span>
            <div className="rightArrow">
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className="user_menu_item hover3"
            onClick={() => {
              setVisible(2);
            }}
          >
            <div className="small_circle">
              <i className="help_filled_icon"></i>
            </div>
            <span>Help & Support</span>
            <div className="rightArrow">
              <i className="right_icon"></i>
            </div>
          </div>
          <div
            className="user_menu_item hover3"
            onClick={() => {
              setVisible(3);
            }}
          >
            <div className="small_circle">
              <i className="dark_filled_icon"></i>
            </div>
            <span>Display & Accessibility</span>
            <div className="rightArrow">
              <i className="right_icon"></i>
            </div>
          </div>
          <div className="user_menu_item hover3" onClick={()=>logout()}>
            <div className="small_circle">
              <i className="logout_filled_icon"></i>
            </div>
            <span>Logout</span>
          </div>
        </div>
      )}
      {visible === 1 && <SettingsPrivacy setVisible={setVisible}/>}
      {visible === 2 && <HelpSupport setVisible={setVisible}/>}
      {visible === 3 && <DisplayAccessibility setVisible={setVisible}/>}
    </div>
  );
}
