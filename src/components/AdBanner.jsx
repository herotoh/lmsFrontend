import React from 'react';
import './AdBanner.css';
import bannerImage from '../assets/bannerh.jpg'; // Assuming your folder is named 'assets'

const AdBanner = () => {
  // Use the imported image variable directly
  const adImageUrl = bannerImage;
  const handleClick = (e) => {
    e.preventDefault(); // This line prevents the default action of the <a> tag (i.e., navigation)
    console.log("Ad banner clicked, but navigation prevented.");
    // You can add other logic here if needed later, e.g., tracking ad clicks
  };

  return (
    <div className="ad-banner-container-global">
      
      <a href="#" onClick={handleClick}>
        <img
          src={adImageUrl}
          alt="Advertisement"
          className="ad-banner-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/160x600/cccccc/000000?text=Ad%20Unavailable";
          }}
        />
      </a>
      <p className="ad-label">Want To Advertise Here. Contact Webmaster @ +65 8888 8888</p>
    </div>
  );
};

export default AdBanner;