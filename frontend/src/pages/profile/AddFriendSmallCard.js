import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
export default function AddFriendSmallCard({ item }) {
  return (
    <div className="addfriendCard">
      <div className="addfriend_imgsmall">
        <img src={item.profile_picture} alt="" />
        <div className="addfriend_infos">
          <div className="addfriend_name">
            {item.profile_name.length > 11
              ? `${item.profile_name.substring(0, 11)}...`
              : item.profile_name}
          </div>
          <div className="light_blue_btn">
          <Button variant="primary"><img
              src="../../../icons/addFriend.png"
              alt=""
              className="filter_blue"
            /> Add Friend</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
