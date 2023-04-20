import { Link } from "react-router-dom";

export default function Friends({ friends }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Friends
        <div className="profile_header_link">See all friends</div>
      </div>
      {friends && (
        <div className="profile_card_count">
          {friends.length === 0
            ? ""
            : friends.length === 1
            ? "1 Friend"
            : `${friends.length} Friends`}
        </div>
      )}
      <div className="profile_card_grid">
        {friends &&
          friends.slice(0, 9).map((friend, index) => (
            <Link
              to={`/profile/${friend.userName}`}
              className="profile_photo_card"
              key={index}
            >
              <img src={friend.avatar} alt="" />
              <span>
                {friend.firstName} {friend.lastName}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
