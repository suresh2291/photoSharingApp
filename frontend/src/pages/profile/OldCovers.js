import { useRef } from "react";
import { useSelector } from "react-redux";
import useClickOutside from "../../helpers/clickOutside";

export default function OldCovers({ photos, setCoverPicture, setShow }) {
  const { user } = useSelector((state) => ({ ...state }));
  const Ref = useRef(null);
  useClickOutside(Ref, () => setShow(false));
  return (
    <div className="blur">
      <div className="postBox selectCoverBox" ref={Ref}>
        <div className="box_header">
          <div
            className="small_circle"
            onClick={() => {
              setShow(false);
            }}
          >
            <i className="exit_icon"></i>
          </div>
          <span>Select photo</span>
        </div>
        <div className="selectCoverBox_links">
          <div className="selectCoverBox_link">Recent Photos</div>
          <div className="selectCoverBox_link">Photo Albums</div>
        </div>
        <div className="old_pictures_wrap scrollbar">
        <h4>Recent Cover Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter(
                  (img) => img.folder === `${user?.userName}/coverPictures`
                )
                .map((photo) => (
                  <img
                    src={photo.url}
                    key={photo.public_id}
                    alt=""
                    onClick={() => {
                      setCoverPicture(photo.url);
                      setShow(false);
                    }}
                  />
                ))}
          </div>
          {/* <h4>Profile Pictures</h4>
          <div className="old_pictures">
            {photos &&
              photos
                .filter((img) => img.folder !== `${user?.userName}/profilePictures`)
                .map((photo) => (
                  <img
                    src={photo.secure_url}
                    key={photo.public_id}
                    alt=""
                    onClick={() => {
                      setCoverPicture(photo.secure_url);
                      setShow(false);
                    }}
                  />
                ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
