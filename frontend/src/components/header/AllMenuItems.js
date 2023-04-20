import { Link } from "react-router-dom";

export default function AllMenuItems({ name, description, icon, link }) {
    return (
      <Link to={link}>
      <div className="all_menu_item hover1">
        <img src={`../../left/${icon}.png`} alt="" />
        <div className="all_menu_col">
          <span>{name}</span>
          <span>{description}</span>
        </div>
      </div>
      </Link>
    );
  }
  