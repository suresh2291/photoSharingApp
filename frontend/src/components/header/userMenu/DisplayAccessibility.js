export default function DisplayAccessibility({ setVisible }) {
  return (
    <div className="absolute_wrap">
      <div className="absolute_wrap_header">
        <div
          className="circle hover1"
          onClick={() => {
            setVisible(0);
          }}
        >
          <i className="arrow_back_icon"></i>
        </div>
        Display & Accessibility
      </div>
      <div className="user_menu_main">
        <div className="small_circle" style={{ width: "50px" }}>
          <i className="dark_filled_icon"></i>
        </div>
        <div className="user_menu_col">
          <span className="user_menu_span1">Dark Mode</span>
          <span className="user_menu_span2">
            Adjust the appearance of Facebook to reduce glare and give your eyes
            a break.
          </span>
        </div>
      </div>
      <label htmlFor="darkOn" className="hover1">
        <span>On</span>
        <input type="radio" name="dark" id="darkOn" />
      </label>
      <label htmlFor="darkOff" className="hover1">
        <span>Off</span>
        <input type="radio" name="dark" id="darkOff" />
      </label>
      <div className="user_menu_main">
        <div className="small_circle" style={{ width: "50px" }}>
          <i className="compact_icon"></i>
        </div>
        <div className="user_menu_col">
          <span className="user_menu_span1">Compact Mode</span>
          <span className="user_menu_span2">
            Make your font size smaller so more content can fit on the screen.
          </span>
        </div>
      </div>
      <label htmlFor="compactOn" className="hover1">
        <span>On</span>
        <input type="radio" name="compact" id="compactOn" />
      </label>
      <label htmlFor="compactOff" className="hover1">
        <span>Off</span>
        <input type="radio" name="compact" id="compactOff" />
      </label>
      <div className="user_menu_item hover3">
        <div className="small_circle">
          <i className="keyboard_icon"></i>
        </div>
        <span>Keyboard</span>
        <div className="rightArrow">
          <i className="right_icon"></i>
        </div>
      </div>
    </div>
  );
}
