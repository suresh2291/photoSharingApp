/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import "./style.css";
import axios from "axios";
import { serverConfig } from "../../../configs/index";

export default function ResendVerification({user}) {

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const sendVerificationEmail = async () => {
    try {
      const { data } = await axios.post(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/resendverification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(data.message);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
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
  );
}
