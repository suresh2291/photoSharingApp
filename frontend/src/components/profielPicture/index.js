import { useRef, useState } from "react";
import "./style.css";
import UpdateProfilePicture from "./UpdateProfilePicture";
import { useSelector } from "react-redux";
export default function ProfilePicture({ username, setShow, profilePicRefresh, photos, getProfile }) {
  const { user } = useSelector((state) => ({ ...state }));
  const refInput = useRef(null);
  const popup = useRef(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState({});
  // useClickOutside(popup, () => {
  //   setShow(false);
  // });

  const handleImage = (e) => {
    let file = e.target.files[0];
    setFile({profilePic:file.name})
    const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size >=5242880) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
    };
  }
  return (
    <div className="blur">
      <input
        type="file"
        ref={refInput}
        hidden
        onChange={handleImage}
        accept="image/jpeg,image/png,image/webp,image/gif"
      />
      <div className="postBox pictureBox" ref={popup}>
        <div className="box_header">
          <div className="small_circle" onClick={()=>setShow(false)}>
            <i className="exit_icon"></i>
          </div>
          <span>Update Profile Picture</span>
        </div>
        <div className="update_picture_wrap">
          <div className="update_picture_buttons">
            <button
              className="light_blue_btn"
              onClick={() => refInput.current.click()}
            >
              <i className="plus_icon filter_blue"></i>
              Upload photo
            </button>
            <button className="gray_btn">
              <i className="frame_icon"></i>
              Add frame
            </button>
          </div>
        </div>
        {error && (
          <div className="postError comment_error">
            <div className="postError_error">{error}</div>
            <button className="blue_btn" onClick={() => setError("")}>
              Try again
            </button>
          </div>
        )}
         <div className="old_pictures_wrap scrollbar">
          <h4>Recent Profile Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter(
                (img) => img.folder === `${user?.userName}/profilePictures`
              )
              .map((photo) => (
                <img
                  src={photo?.url}
                  key={photo?.public_id}
                  alt=""
                  onClick={() => setImage(photo?.url)}
                />
              ))}
          </div>
          <h4>Profile Pictures</h4>
          <div className="old_pictures">
            {photos
              .filter(
                (img) => img.folder !== `${user?.userName}/profilePictures`
              )
              .map((photo) => (
                <img
                  src={photo?.url}
                  key={photo?.public_id}
                  alt=""
                  onClick={() => setImage(photo?.url)}
                />
              ))}
          </div>
        </div>
      </div>
      {image && (
        <UpdateProfilePicture
          setImage={setImage}
          image={image}
          setError={setError}
          file={file}
          setShow={setShow}
          profilePicRefresh={profilePicRefresh}
          getProfile={getProfile}
        />
      )}
    </div>
  );
}
