import './style.css';
import { Dots, NewRoom, Search }from '../../../svg'
import Contacts from './Contacts';

export default function RightHome({user}) {
  const color = "#65676b";
  return (
    <div className='right_home'>
        <div className="heading">Sponsored</div>
        <div className="splitter1"></div>
        <div className="contacts_wrap">
          <div className="contacts_header">
            <div className="contacts_header_left">Contacts</div>
            <div className="contacts_header_right">
              <div className="contacts_circle hover1">
                <NewRoom color={color}/>
              </div>
              <div className="contacts_circle hover1">
                <Search color={color}/>
              </div>
              <div className="contacts_circle hover1">
                <Dots color={color}/>
              </div>
            </div>
          </div>
          <div className="contacts_list">
            <Contacts user={user}/>
          </div>
        </div>
    </div>
  )
}
