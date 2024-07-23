import '../styles/sheets/dash.scss';
import { Icon } from '@iconify/react/dist/iconify.js';
import char1 from "../assets/images/char1.jpeg";
import char2 from "../assets/images/char2.jpeg";
import React, { useState, useEffect } from 'react';

const Dash: React.FC = () => {
  const [browser, setBrowser] = useState<string>('');

  const getBrowser = (): string => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
      browserName = "Samsung Internet";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      browserName = "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Edge") > -1) {
      browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Google Chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Apple Safari";
    }
    return browserName;
  };

  useEffect(() => {
    const updateBrowserInfo = () => {
      const detectedBrowser = getBrowser();
      setBrowser(detectedBrowser);
      console.log(`Browser: ${detectedBrowser}`);
    };
    updateBrowserInfo();
    window.addEventListener('resize', updateBrowserInfo);
    return () => {
      window.removeEventListener('resize', updateBrowserInfo);
    };
  }, []);

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
        <div className="browser-info">Browser: {browser}</div>
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
  );
};

export default Dash;
