import * as React from "react"

const Minus = (props) => (
  <svg
    width={40}
    height={40}
    viewBox="-9.6 -9.6 43.2 43.2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x={-9.6}
      y={-9.6}
      width={43.2}
      height={43.2}
      rx={21.6}
      fill="#d1d1d1"
      strokeWidth={0}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12Zm5.5-1.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-11Z"
      fill="#000"
    />
  </svg>
)

export default Minus