import * as React from "react";
const Undo = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    stroke="#000"
    viewBox="0 0 512 512"
    {...props}
  >
    <title>{"ionicons-v5-b"}</title>
    <path d="M245.09 327.74v-37.32c57.07 0 84.51 13.47 108.58 38.68 5.4 5.65 15 1.32 14.29-6.43-5.45-61.45-34.14-117.09-122.87-117.09v-37.32a8.32 8.32 0 0 0-14.05-6L146.58 242a8.2 8.2 0 0 0 0 11.94L231 333.71a8.32 8.32 0 0 0 14.09-5.97Z" />
    <path
      d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64Z"
      style={{
        fill: "none",
        stroke: "#000",
        strokeMiterlimit: 10,
        strokeWidth: 32,
      }}
    />
  </svg>
);
export default Undo;