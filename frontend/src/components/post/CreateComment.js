import { useEffect, useRef, useState } from "react";
import EmojiPicker  from "emoji-picker-react";
import { uploadImages } from "../../functions/uploadImages";
import { comment } from "../../functions/post";
import { ClipLoader } from "react-spinners";

export default function CreateComment({ user, postId, setComments, setCount }) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const [loading, setLoading] = useState(false);
  const textRef = useRef(null);
  const imgInput = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);

  const handleEmoji = (e, { emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = text.substring(0, ref.selectionStart);
    const end = text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setText(newText);
    setCursorPosition(start.length + emoji.length);
  };
  const handleImage = async(event) => {
    setLoading(true);
    let file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
      setError(`${file.name} format is not supported.`);
      setLoading(false);
      return;
    } else if (file.size >=5242880) {
      setError(`${file.name} is too large max 5mb allowed.`);
      setLoading(false);
      return;
    }

    const path = `${user?.userName}/postImages/${postId}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("userId", user?.id);
        formData.append("images", file);

        const response = await uploadImages(
          formData,
          path,
          user?.id,
          null,
          null,
          null,
          user?.token
        );
        console.log(response);
        setCommentImage(response[0].url);
        setLoading(false);
  };

  const handleComment = async (e) => {
    if (e.key === "Enter") {
      if (commentImage != "") {
        setLoading(true);
        const comments = await comment(
          postId,
          text,
          commentImage,
          user.token
        );
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      } else {
        setLoading(true);
        const comments = await comment(postId, text, "", user.token);
        setComments(comments);
        setCount((prev) => ++prev);
        setLoading(false);
        setText("");
        setCommentImage("");
      }
    }
  };
  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.picture} alt="" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <EmojiPicker 
              onEmojiClick={handleEmoji}
              emojiStyle="google"
              theme="auto"
            />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png"
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleComment}
          />
          <div className="comment_circle" style={{ marginTop: "5px" }}>
            <ClipLoader size={20} color="#1876f2" loading={loading} />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker((prev) => !prev);
            }}
          >
            <i className="emoji_icon"></i>
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <i className="camera_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <i className="exit_icon"></i>
          </div>
        </div>
      )}
    </div>
  );
}
