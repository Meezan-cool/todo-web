import '../styles/sheets/dash.scss'
import { Icon } from '@iconify/react/dist/iconify.js';
import char1 from "../assets/images/char1.jpeg";
import char2 from "../assets/images/char2.jpeg";

const Dash = () => {
  return (
    <div className="dash">
      <div className="dash-header">
        <div className="dash-icon">
        <Icon icon="gravity-ui:bars-unaligned" className='bar-icon'/>
        </div>
        <div className="char-image dash-profile">
          <img src={char1} alt="" />
        </div>
      </div>
      <div className="dash-user">
        <div className="user-name">Hi Maroof</div>
        <div className="pending-tasks">6 Tasks are pending</div>
      </div>
      <div className="card-prop big-card">
        <div className="card-title">Mobile App Design</div>
        <div className="card-sub-title">Meezan and Maroof</div>
        <div className="character">
        <div className="char-images">
          <div className="char-image">
            <img src={char1} alt="" />
          </div>
          <div className="char-image layered-image">
            <img src={char2} alt="" />
          </div>
        </div>
        <div className="more">more</div>
        </div>
      </div>

      <div className="review-part">
        <div className="review-text">Monthly Review</div>
        <div className="review-icon">
          <Icon icon="solar:bag-outline" className='bag'/>
        </div>
      </div>

      <div className="review-boxes">
        <div className="card-prop normal-card">
          <div className="card-number">22</div>
          <div className="card-text">Done</div>
        </div>
        <div className="card-prop small-card">
        <div className="card-number">7</div>
        <div className="card-text">In progress</div>
        </div>
        <div className="card-prop small-card">
        <div className="card-number">10</div>
        <div className="card-text">Ongoing</div>
        </div>
        <div className="card-prop normal-card2">
        <div className="card-number">12</div>
        <div className="card-text">Waiting for review</div>
        </div>
      </div>

    </div>
  )
}

export default Dash