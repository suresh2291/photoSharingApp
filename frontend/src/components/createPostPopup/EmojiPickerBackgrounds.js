/**
 * The component imports necessary dependencies such as useEffect, useRef, useState, EmojiPicker, and useMediaQuery from various libraries.
 * The component receives several props such as text, user, setText, type2, background, and setBackground.
 * Inside the component, there are several state variables defined using the useState hook to manage the component's behavior.
 * The component uses the useEffect hook to update the cursor position in the text area when the cursorPosition state variable changes.
 * There is a handleEmoji function that is triggered when an emoji is clicked. It updates the text state by inserting the selected emoji at the current cursor position and also updates the cursor position accordingly.
 * An array named postBackgrounds contains URLs of different background images used in the component.
 * The component defines event handlers (backgroundHanlder, removeBackground) for managing the background images displayed.
 * The sm variable is set using the useMediaQuery hook to determine if the screen size is smaller than 550px.
 * The component renders a div element that contains a textarea for entering text, and there are various classNames and styles applied conditionally based on the component's state and props.
 * There is an EmojiPicker component that is conditionally rendered based on the picker state variable.
 * An image is rendered that toggles the display of background images when clicked.
 * The background images are displayed in a div element when showBgs state is true, and clicking on an image sets the background accordingly.
 */
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useMediaQuery } from "react-responsive";

export default function EmojiPickerBackgrounds({
  text,
  user,
  setText,
  type2,
  background,
  setBackground,
}) {
  const [picker, setPicker] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const bgRef = useRef(null);

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
  const postBackgrounds = [
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681901192/10_tqe13n.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681901191/7_m3svur.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681846753/6_nnfggb.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900201/6_ifbegv.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900201/9_kz2as6.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900201/8_cmqjnj.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900201/7_g0s1mo.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900201/5_fk2c7e.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900200/2_cwoecu.jpg",
    "https://res.cloudinary.com/deph1hkms/image/upload/v1681900200/3_qtxreo.jpg"
  ];
  const backgroundHanlder = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = (i) => {
    bgRef.current.style.backgroundImage = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };
  const sm = useMediaQuery({
    query: "(max-width:550px)",
  });
  
  return (
    <div className={type2 ? "images_input" : ""}>
      <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`What's on your mind, ${user?.firstName}?`}
          className={`post_input ${type2 ? "input2" : ""}${
            sm && !background && "l0"
          }`}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 32)
                : "0"
            }%`
          }}
        ></textarea>
      </div>
      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movepicker2" : "rlmove"
            }`}
          >
            <EmojiPicker
              onEmojiClick={handleEmoji}
              emojiStyle="google"
              theme="auto"
            />
          </div>
        )}
        {!type2 && (
          <img
            src="../../../icons/colorful.png"
            alt=""
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div
              className="no_bg"
              onClick={() => {
                removeBackground();
              }}
            ></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt=""
                onClick={() => {
                  backgroundHanlder(i);
                }}
              />
            ))}
          </div>
        )}
        <i
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          onClick={() => {
            setPicker((prev) => !prev);
          }}
        ></i>
      </div>
    </div>
  );
}
