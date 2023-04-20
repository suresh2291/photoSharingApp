import { useState } from "react";
import DrawingBoard from "../../components/createPostPopup/DrawingBoard";
import { Blocks } from "react-loader-spinner";

export default function Display({ photos, user, photoLoading }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState({});
  const handleImageClick = (index, assetId) => {
    setFile({ fileName: assetId });
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  return (
    <div className="photos_card">
      <span className="no-photos">Photos</span>
      {photoLoading ? (
        <div className="sekelton_loader">
        <Blocks
          visible={true}
          height="90"
          width="90"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
        />
      </div>
      ) : (
        <div className="photos_card_grid">
          {photos.resources &&
            photos.resources.map((img, index) => (
              <div className="photos_photo_card" key={index}>
                <img
                  src={img.secure_url}
                  alt=""
                  onClick={() => handleImageClick(index, img.filename)}
                />
              </div>
            ))}

          {selectedImageIndex !== null && showModal && (
            <div className="postBox annotate-box" style={{ zIndex: 9999 }}>
              {/* <span>Images {selectedImageIndex + 1} to {images.length}</span> */}
              <DrawingBoard
                imageUrl={photos.resources[selectedImageIndex].url}
                file={file}
                setError={setError}
                user={user}
                setSelectedImageIndex={setSelectedImageIndex}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
