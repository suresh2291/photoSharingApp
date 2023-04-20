import * as React from "react";
const TextIcon = (props) => (
  <svg
    id="Icons"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    width="35px"
    height="35px"
    fill="#000000"
    {...props}
  >
    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g id="SVGRepo_iconCarrier">
      <style type="text/css">
        {
          " .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} "
        }
      </style>
      <circle className="st0" cx={6} cy={6} r={3} />
      <circle className="st0" cx={26} cy={6} r={3} />
      <circle className="st0" cx={6} cy={26} r={3} />
      <circle className="st0" cx={26} cy={26} r={3} />
      <line className="st0" x1={6} y1={9} x2={6} y2={23} />
      <line className="st0" x1={26} y1={9} x2={26} y2={23} />
      <line className="st0" x1={9} y1={26} x2={23} y2={26} />
      <line className="st0" x1={9} y1={6} x2={23} y2={6} />
      <polyline className="st0" points="11,13 11,11 21,11 21,13 " />
      <line className="st0" x1={14} y1={21} x2={18} y2={21} />
      <line className="st0" x1={16} y1={21} x2={16} y2={11} />
    </g>
  </svg>
);
export default TextIcon;