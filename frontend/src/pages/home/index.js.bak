import { useRef, useState } from "react";
import Header from "../../components/header";
import useClickOutside from "../../helpers/clickOutside";

export default function Home() {
const [visible, setVisible]  = useState(true);
const element = useRef(null)  
  useClickOutside(element, ()=>{
    setVisible(false);
  })
  return (
    <div>
      <Header/>
      { visible && <div className="card" ref={element}></div> }
    </div>
  );
}
