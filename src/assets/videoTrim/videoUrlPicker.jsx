
import React, { useEffect, useState } from 'react';

import './global.css'
import 'firebase/functions';


function VideoUrlPicker({ showVideo, handleChange, children, outSideUrl }) {

const [loading, setLoading] = useState(false);


useEffect(() => {
  if (outSideUrl) {
    handleConvert(outSideUrl)
  }
}, [outSideUrl]);



const handleConvert = async (url) => {
  try {
    setLoading(true);
    const file = await fetch(url).then((response) => response.blob());
    // Create a file object with a random name
    const fileName = `video_${Math.floor(Math.random() * 100000)}.mp4`;
    const videoFile = new File([file], fileName, { type: 'video/mp4' });
    await handleChange(videoFile); // Pass the video file to the parent component
    
  } catch (error) {
    if(error.message === 'Failed to fetch'){
      alert('This Video protected by law and cannot be downloaded. Convert it to mp4 format and upload it !')
    }
    console.error('Error fetching or converting the video:', error);

  } finally {

    setLoading(false);
  }
};

return showVideo ? (

  <>
    {children}
  </>

) : (
  <div className={`url-picker`}>
    <div id='conver-button-cont'onClick={handleConvert}>
        <div
          disabled={loading}
          className="convert-button"
        >
          {loading ? 'Loading...' : 'Convert'}
        </div>
    </div>
  </div>
);
}

export default VideoUrlPicker;