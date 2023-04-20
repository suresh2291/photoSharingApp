import "./style.css";
import LoginForm from "../../components/login/LoginForm";
import RegisterForm from "../../components/login/RegisterForm";
import ActivateForm from "./ActivateForm";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Navigate  } from "react-router-dom";
import "./style.css";
import axios from "axios";
import Cookies from "js-cookie";
import { serverConfig } from "../../configs/index";
export default function Activate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((user) => ({ ...user }));
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(""),
        [error, setError] = useState(""),
        [loading, setLoading] = useState(true);
  const search = useLocation().search
  const queryParams = new URLSearchParams(search)
  useEffect(() =>{
    activateAccount();
  },[]);
  const activateAccount = async () =>{
    try{
      setLoading(true);
      const {data} = await axios.post(
      `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/activate`,
      {"token":queryParams.get('token')},
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if(user.verified === true){
      setError(data.message)
      setLoading(true);
    }
    setSuccess(data.message)
    Cookies.set("user", JSON.stringify({ ...user, verified: true }));
      dispatch({
        type: "VERIFY",
        payload: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);

    }catch(err){
     setError(err.response.data.message);
     <Navigate  to="/login" />
     setLoading(true);
    }
  };
  return (
    
    <div className="login">
      {success && (
        <ActivateForm
          type="success"
          header="Account verification succeded."
          text={success}
          loading={loading}
        />
      )}
      {error && (
        <ActivateForm
          type="error"
          header="Account verification failed."
          text={error}
          loading={loading}
        />
      )}
      <div className="login_wrapper">
        <LoginForm setVisible={setVisible} />
        {visible && <RegisterForm setVisible={setVisible} />}
      </div>
    </div>
  );
}
