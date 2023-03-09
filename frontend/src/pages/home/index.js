import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import CreatePost from "../../components/home/createPost";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import './style.css'
export default function Home() {
  const { user } = useSelector((user) => ({ ...user }));
  return (
    <div className="home">
      <Header />
      <LeftHome user={user}/>
      <RightHome user={user}/>
      <div className="home_middle">
          <CreatePost user={user}/>
      </div>
    </div>
  );
}
