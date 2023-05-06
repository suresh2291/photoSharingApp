/**
 * This Component is shown in when user clicks for selecting the images inside the post Component.
 */
import { Button } from "react-bootstrap";
import { Photo } from "../../svg";
export default function AddToYourPost({ setShowPrev }) {
  return (
    <div className="addtoyourpost">
      <div className="addto_text">Add to your post</div>
      <Button variant="none" style={{border: "none"}}
        className="post_header_right hover1"
        onClick={() => {
          setShowPrev(true);
        }}
      >
        <Photo color="#45bd62" />
      </Button>
    </div>
  );
}
