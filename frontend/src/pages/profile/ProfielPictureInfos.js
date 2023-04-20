import { useRef, useState } from "react";
import ProfilePicture from "../../components/profielPicture";
import Friendship from "./Friendship";
import { Link } from "react-router-dom";
export default function ProfielPictureInfos({ profile, visitor, photos, getProfile }) {
  const [show, setShow] = useState(false);
  const profilePicRefresh = useRef(null)
  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture setShow={setShow} profilePicRefresh={profilePicRefresh} photos={photos} getProfile={getProfile}/>}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={profilePicRefresh}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile?.avatar})`,
            }}
          ></div>
          {!visitor && (
            <div className="profile_circle hover1" onClick={()=>setShow(true)}>
              <i className="camera_filled_icon"></i>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile.firstName} {profile.lastName}
            {/* <div className="othername">Othername</div> */}
          </div>
          <div className="profile_friend_count">
            {profile?.friends && (
              <div className="profile_card_count">
                {profile?.friends.length === 0
                  ? ""
                  : profile?.friends.length === 1
                  ? "1 Friend"
                  : `${profile?.friends.length} Friends`}
              </div>
            )}
          </div>
          <div className="profile_friend_imgs">
            {profile?.friends &&
              profile.friends.slice(0, 7).map((friend, i) => (
                <Link to={`/profile/${friend.userName}`} key={i}>
                  <img
                    src={friend.avatar}
                    alt=""
                    style={{
                      transform: `translateX(${-i * 7}px)`,
                      zIndex: `${i}`,
                    }}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      {visitor ? (
         <Friendship friendshipp={profile?.friendship} profileid={profile._id} getProfile={getProfile}/>
      ) : (
        <div className="profile_w_right">
          {/* <div className="blue_btn">
          <img src="../../../icons/plus.png" alt="" className="invert" />
          <span>Add to story</span>
        </div> */}
          <div className="gray_btn">
            <i className="edit_icon"></i>
            <span>Edit profile</span>
          </div>
        </div>
      )}
    </div>
  );
}
