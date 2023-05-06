/**
 * This component is responsible for showing the images in create post, after uploading the images.
 * when user clicks on the image then Annotation toolbar would appear.
 */
import React, { useRef, useState } from "react";
import DrawingBoard from "./DrawingBoard";

function ImageGallery({ images, file, user, setError, setImages}) {

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };
  

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((img, index) => index !== indexToRemove))
  }

  const CloseButton = ({ index }) => (
    <div className="close_circle" onClick={() => removeImage(index)}>
      <i className="exit_icon"></i>
    </div>
  );

  return (
    <div className="overflow_a scrollbar">
    <div
      className={
        images.length === 1
          ? "preview1"
          : images.length === 2
          ? "preview2"
          : images.length === 3
          ? "preview3"
          : images.length === 4
          ? "preview4 "
          : images.length === 5
          ? "preview5"
          : images.length % 2 === 0
          ? "preview6"
          : "preview6 singular_grid"
      }
    >
      {images.map((img, index) => (
        <img
        key={index}
          src={img.url}
          alt=""
          onClick={() =>  handleImageClick(index)}
        />
      ))}
    </div>
    {selectedImageIndex !== null && showModal && ( 
   <div className="postBox annotate-box">
   {/* <span>Images {selectedImageIndex + 1} to {images.length}</span> */}
     <DrawingBoard
       imageUrl={images[selectedImageIndex].url}
       file={file}
       setError={setError}
       user={user}
       setSelectedImageIndex={setSelectedImageIndex}
     />
 </div>
      )}
    </div>
  );
}

export default ImageGallery;
