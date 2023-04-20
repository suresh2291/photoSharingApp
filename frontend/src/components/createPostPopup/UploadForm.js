import React, { useRef, useState } from "react";
import { uploadImages } from "../../functions/uploadImages";
import { ColorRing, Vortex } from "react-loader-spinner";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import ImageGallery from "./ImageGallery";
import useClickOutside from "../../helpers/clickOutside";

export default function UploadForm({
  text,
  user,
  setText,
  images,
  setImages,
  setShowPrev,
  setError,
  setPostVisible,
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState({});
  const imageInputRef = useRef(null);
  useClickOutside(imageInputRef, () => {
    setPostVisible(true);
    setShowPrev(true)
  });
  const handleFileSelect = (event) => {
    try{
      setLoading(true);
    let files = Array.from(event.target.files);

    if (files.length > 10) {
      setError(`Please select 10 images.`);
      setLoading(false);
      return;
    }
    files.forEach(async (img) => {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(img.type)) {
        setError(
          `${img.name} format is unsupported ! only Jpeg, Png are allowed.`
        );
        files = files.filter((item) => item.name !== img.name);
        setLoading(false);
        return;
      } else if (img.size >=5242880) {
        setError(`${img.name} size is too large max 5mb allowed.`);
        files = files.filter((item) => item.name !== img.name);
        setLoading(false);
        return;
      } else {
        setFile({fileName:img.name})
        const path = `${user?.userName}/postImages`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("userId", user?.id);
        formData.append("images", img);

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
        setImages((images) => [...images, response[0]]);
      }
      setLoading(false);
    });
    }catch(error){
      setError(error.response.data.message);
    }
    
  };

  return (
    <div className="overflow_a scrollbar">
      <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />
      <div className="add_pics_wrap">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />{" "}
            Please Wait Loading Images ....
          </div>
        ) : (
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            hidden
            ref={imageInputRef}
            onChange={handleFileSelect}
          />
        )}
        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            {/* <div className="preview_actions">
              <button
                className="hover1"
                onClick={() => {
                  imageInputRef.current.click();
                }}
              >
                <i className="addPhoto_icon"></i>
                Add Photos
              </button>
            </div> */}
            <div
              className="small_white_circle"
              onClick={() => {
                setImages([]);
              }}
            >
              <i className="exit_icon"></i>
            </div>
            <ImageGallery images={images} setImages={setImages} user={user} file={file} setError={setError} />
            
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div
              className="small_white_circle"
              onClick={() => {
                setShowPrev(false);
              }}
            >
              <i className="exit_icon"></i>
            </div>
            <div
              className="add_col"
              onClick={() => {
                setShowPrev(true);
                imageInputRef.current.click();
              }}
            >
              <div className="add_circle">
                <i className="addPhoto_icon"></i>
              </div>
              <span>Add Photos/Videos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
