import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header";
import CreatePost from "../../components/home/createPost";
import LeftHome from "../../components/home/left";
import ResendVerification from "../../components/home/ResendVerification";
import RightHome from "../../components/home/right";
import './style.css'
export default function Home() {
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div className="home">
      <Header />
      <LeftHome user={user}/>
      <RightHome user={user}/>
      <div className="home_middle">
        {!user.verified && <ResendVerification user={user}/>}
          <CreatePost user={user}/>
      </div>
    </div>
  );
}
