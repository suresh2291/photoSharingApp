import { Formik, Form } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import LoginInput from "../inputs/loginInput";
import { useState } from "react";
import DotLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Vortex } from "react-loader-spinner";
import { serverConfig } from "../../configs";
import { useMediaQuery } from "react-responsive";
const loginInfos = {
  email: "",
  password: "",
};
export default function LoginForm({ setVisible }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState(loginInfos);
  const { email, password } = login;
  const isSmallScreen = useMediaQuery({ maxWidth: 440 });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };
  const loginValidation = Yup.object({
    email: Yup.string()
      .required("Email address is required.")
      .email("Must be a valid email.")
      .max(100),
    password: Yup.string().required("Password is required"),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const loginSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${serverConfig.port.backendUrl}/${serverConfig.apiPath.users}/login`,
        {
          email,
          password,
        }
      );
      if (!data.verified) {
        dispatch({ type: "USERDATA", payload: data });
        Cookies.set("user", JSON.stringify(data));
        setTimeout(() => {
          setError(
            "It seems like you have not verified your email yet. Please check your inbox for an email from us with instructions on how to verify your account."
          );
          navigate("/verify");
          setLoading(false);
        }, 500);
      } else {
        setError("");
        setSuccess(data.message);
        setTimeout(() => {
          dispatch({ type: "USERDATA", payload: data });
          Cookies.set("user", JSON.stringify(data));
          navigate("/");
        }, 3000);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
  };
  return (
    <div className="login_wrap">
      <div className="login_1">
      <img src={isSmallScreen ? 'https://res.cloudinary.com/deph1hkms/image/upload/c_thumb,w_200,g_face/v1680255521/palogo-removebg-preview_a3cr3y.png' : 'https://res.cloudinary.com/deph1hkms/image/upload/v1680254984/app_name_omiuxq.png'} alt="MyImage" /><br/>
        <span>
          Discover the beauty of visual communication by sharing and commenting
          on photos with annotations
        </span>
      </div>
      <div className="login_2">
        <div className="login_2_wrap">
          <Formik
            enableReinitialize
            initialValues={{
              email,
              password,
            }}
            validationSchema={loginValidation}
            onSubmit={() => {
              loginSubmit();
            }}
          >
            {(formik) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  placeholder="Email address"
                  onChange={handleLoginChange}
                />
                <LoginInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleLoginChange}
                  bottom
                />
                <button type="submit" className="blue_btn">
                  Log In
                </button>
              </Form>
            )}
          </Formik>
          <Link to="/reset" className="forgot_password">
            Forgotten password?
          </Link>
          {loading ? (
            <Vortex
              visible={true}
              height="50"
              width="50"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["red", "green", "blue", "yellow", "orange", "purple"]}
            />
          ) : (
            ""
          )}
          {/* <DotLoader color="#36d7b7" loading={loading} size={20} /> */}
          {/* <div className="sign_splitter"></div> */}
          {error && <div className="error_text">{error}</div>}
          {success && <div className="success_text">{success}</div>}
          <button
            className="blue_btn open_signup"
            onClick={() => setVisible(true)}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
