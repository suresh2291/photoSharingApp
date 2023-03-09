import LeftLink from './LeftLink';
import './style.css';
import {left} from "../../../metaData/home"
export default function LeftHome({user}) {
  return (
    <div className="left_home">
        <div className="left_link">
            <img src={user?.picture} alt="" />
            <span>{user?.firstName} {user?.lastName}</span>
        </div>
        {left.slice(0,7).map((link,i)=>(
            <LeftLink key={i} img={link.img} text={link.text} notification={link.notification}/>
        ))}
    </div>
  )
}
