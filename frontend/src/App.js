import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/login/activate";
import Reset from "./pages/reset";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Friends from "./pages/friends";
import Photos from "./pages/Photos";
import ResendVerification from "./components/home/ResendVerification";

function App() {
  const [postVisible, setPostVisible] =  useState(false);
  const { user, darkTheme  } = useSelector((state) => ({ ...state }));

  return (
    <div className={darkTheme ? "dark": ""}>
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route element={<LoggedInRoutes />}>
          <Route path="/profile" element={<Profile setPostVisible={setPostVisible}/> } exact />
          <Route path="/profile/:userName" element={<Profile setPostVisible={setPostVisible} />} exact />
          <Route
            path="/friends"
            element={
              < Friends setPostVisible={setPostVisible} />
            }
            exact
          />
          <Route
            path="/photos"
            element={
              < Photos setPostVisible={setPostVisible} />
            }
            exact
          />
          <Route
            path="/friends/:type"
            element={
              < Friends setPostVisible={setPostVisible} />
            }
            exact
          />
          <Route path="/" element={<Home setPostVisible={setPostVisible} user={user} postVisible ={postVisible}/>} exact />
          <Route path='/activate' element={<Activate/>} exact/>
        </Route>
        <Route path='/reset' element={<Reset/>} exact />
        <Route path='/verify' element={<ResendVerification />} exact />
      </Routes>
    </div>
  );
}

export default App;
