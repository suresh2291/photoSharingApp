import { Dropdown } from "react-bootstrap";
import MenuItem from "./MenuItem";
import { Dots } from "../../svg";
import useOnClickOutside from "../../helpers/clickOutside";
import { useRef, useState } from "react";
import { deletePost, savePost } from "../../functions/post";

/**
 * For each post we have a right side dropdowns for selecting the options, like fullscreen, download images, save post, delete post etc.
 */
export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
  showMenu,
  token,
  postId,
  checkSaved,
  setCheckSaved,
  images,
  postRef,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const test = postUserId === userId;
  const menu = useRef(null);
  useOnClickOutside(menu, () => setShowMenu(false));
  const saveHandler = async () => {
    savePost(postId, token);
    if (checkSaved) {
      setCheckSaved(false);
    } else {
      setCheckSaved(true);
    }
  };
  const downloadImages = async () => {
    images.map(async (img) => {
      const imgUrl = img.url;
      const filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
      const response = await fetch(img.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const deleteHandler = async () => {
    const res = await deletePost(postId, token);
    if (res.status === "ok") {
      postRef.current.remove();
    }
  };

  return (
    <Dropdown show={showMenu} ref={menu} onClose={() => setShowMenu(false)}>
      <Dropdown.Toggle
        variant="light"
        style={{ color: "grey" }}
      ></Dropdown.Toggle>
      <Dropdown.Menu>
        {/* {test && (
          <MenuItem icon="pin_icon" title="Pin Post" onClick={() => {}} />
        )} */}
        <div onClick={() => saveHandler()}>
          {checkSaved ? (
            <MenuItem
              icon="save_icon"
              title="Unsave Post"
              subtitle="Remove this from your saved items."
            />
          ) : (
            <MenuItem
              icon="save_icon"
              title="Save Post"
              subtitle="Add this to your saved items."
            />
          )}
        </div>
        <Dropdown.Divider />
        {test && (
          <MenuItem icon="edit_icon" title="Edit Post" onClick={() => {}} />
        )}
        {/* {!test && (
          <MenuItem
            icon="turnOnNotification_icon"
            title="Turn on notifications for this post"
            onClick={() => {}}
          />
        )} */}
        {imagesLength && (
          <MenuItem
            icon="download_icon"
            title="Download"
            onClick={() => downloadImages()}
          />
        )}
        {imagesLength && (
          <MenuItem
            icon="fullscreen_icon"
            title="Enter Fullscreen"
            onClick={() => {}}
          />
        )}
        {imagesLength && (
          <MenuItem
            icon="fullscreen_icon"
            title="Add Annotations"
            onClick={() => {}}
          />

        )}
        {/*{test && (
          <MenuItem
            img="../../../icons/lock.png"
            title="Edit audience"
            onClick={() => {}}
          />
        )}
         {test && (
          <MenuItem
            icon="turnOffNotifications_icon"
            title="Turn off notifications for this post"
            onClick={() => {}}
          />
        )}
        {test && (
          <MenuItem
            icon="delete_icon"
            title="Turn off translations"
            onClick={() => {}}
          />
        )} */}
        {test && (
          <MenuItem icon="date_icon" title="Edit Date" onClick={() => {}} />
        )}
        {/* {test && (
          <MenuItem
            icon="refresh_icon"
            title="Refresh share attachment"
            onClick={() => {}}
          />
        )} */}
        {/* {test && (
          <MenuItem
            icon="archive_icon"
            title="Move to archive"
            onClick={() => {}}
          />
        )} */}
        {test && (
          <MenuItem
            icon="trash_icon"
            title="Move to trash"
            subtitle="items in your trash are deleted after 30 days"
            onClick={() => deleteHandler()}
          />
        )}
        {/* {!test && <Dropdown.Divider />}
        {!test && (
          <MenuItem
            img="../../../icons/report.png"
            title="Report post"
            subtitle="i'm concerned about this post"
            onClick={() => {}}
          />
        )} */}
      </Dropdown.Menu>
    </Dropdown>
  );
}
