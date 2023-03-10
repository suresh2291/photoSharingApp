import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/login/activate";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>

        <Route element={<LoggedInRoutes />}>
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/" element={<Home />} exact />
          <Route path='/activate' element={<Activate/>} exact/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
