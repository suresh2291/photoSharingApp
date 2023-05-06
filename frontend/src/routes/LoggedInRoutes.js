/**
 * This code defines a function called `LoggedInRoutes` that is intended to serve as a router for authenticated users. 
  It imports the `useSelector` hook from the `react-redux` library and the `Outlet` component from the `react-router-dom` library,
  as well as a `Login` component from an external file.
 * Inside the function, it destructures the `user` object from state using `useSelector`, which is a hook for selecting data from the Redux store. 
 * Next, it uses a ternary operator to check if there is a valid user. If there is, it renders the `Outlet` component, which is a placeholder for the child routes within a parent route. 
  If not, it renders the `Login` component which allows the user to login.
 */
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Login from "../pages/login";

export default function LoggedInRoutes() {
const { user } = useSelector((state)=>({ ...state }))
  return user ? <Outlet /> : <Login/>
}
