import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

export default function MenuItem({ icon, title, subtitle, img, onClick }) {
  return (
    <Dropdown.Item onClick={onClick}>
      <div className="post_menu_text">
      {img ? <img src={img} alt="" /> : <i className={icon}></i>}
      <span>{title}</span>
    </div>
    {subtitle && <div className="menu_post_col">{subtitle}</div>}
    </Dropdown.Item>
  );
}
  