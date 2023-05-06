/**
 * This component is responsible for displaying the list of menu items in right header. It has both right and left menu.
 */
import { useRef } from "react";
import { menu, create } from "../../metaData/allMenu";
import AllMenuItems from "./AllMenuItems";
export default function AllMenu() {
  return (
    <div className="all_menu">
      <div className="all_menu_header">Menu</div>
      <div className="all_menu_wrap scrollbar">
        <div className="all_left">
          <div className="all_menu_search">
            <i className="amm_s_ic"></i>
            <input type="text" placeholder="Search Menu" />
          </div>
          <div className="all_menu_group">
            <div className="all_menu_group_header">Social</div>
            {menu.slice(0, 1).map((item, i) => (
              <AllMenuItems
                name={item.name}
                description={item.description}
                icon={item.icon}
                link={item.link}
                key={i}
              />
            ))}
          </div>
          <div className="all_menu_group">
            <div className="all_menu_group_header">Personal</div>
            {menu.slice(1, 2).map((item, i) => (
              <AllMenuItems
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
          <div className="all_menu_group">
            <div className="all_menu_group_header">Communication</div>
            {menu.slice(2,3).map((item, i) => (
              <AllMenuItems
                name={item.name}
                description={item.description}
                icon={item.icon}
                key={i}
              />
            ))}
          </div>
        </div>
        <div className="all_right">
          <div className="all_right_header">Create</div>
          {create.map((item, i) => (
            <div className="all_right_item hover1" key={i}>
              <div className="all_right_circle">
                <i className={item.icon}></i>
              </div>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
