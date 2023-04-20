/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { serverConfig } from "../../../configs/index";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
export default function ResendVerification() {
  const { user } = useSelector((state) => ({ ...state }));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendVerificationEmail = async () => {
    try {
      console.log("resend email:  ", user)
      const { data } = await axios.post(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/resendverification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setSuccess(data.message);
      setError("");
    } catch (err) {
      setError(err.response.data.message);
      setSuccess("");
    }
  };

  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  return (
    <div className="verify">
      <div className="verify_header">
        <img src="https://res.cloudinary.com/deph1hkms/image/upload/c_scale,h_34,r_1,w_48/v1680255521/palogo-removebg-preview_a3cr3y.png" alt="" />
        {user ? (
          <div className="right_reset">
            <button
              className="blue_btn"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="right_reset">
            <button className="blue_btn">Login</button>
          </Link>
        )}
      </div>
      <div className="reset_wrap">
      <div className="send_verification">
      <span>
        We're sorry, but it appears that your account has not been activated
        yet. Please check your email for a verification link and click on it to
        complete the activation process.
      </span>

      <a
        onClick={() => {
          sendVerificationEmail();
        }}
      >
        Resend Email Verification
      </a>
      {success && <div className="success_text">{success}</div>}
      {error && <div className="error_text">{error}</div>}
    </div>
      </div>
    </div>
  
  );
}
