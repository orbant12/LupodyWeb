import React from "react";
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import "../../Css/folder.css";

const WatchLaterCard = ({
  imgSrc,
  title,
  tags,
  related_count,
  video_size
}) => {
  return (
    <div className="file-map">
    <div className="map-img">
      <img className="img-content" src={imgSrc} crossOrigin="anonymus"/>
    </div>
    <div className="map-right-con">
      <h1>{title}</h1>
      <div className="related-video-cont">
        <div className="related-video">
      <VideoLibraryIcon/>
        <h5>Created At: {related_count}</h5>
        </div>
        <h5 className="storage-take-number">{video_size} Views</h5>
      </div>
     
      <h5 style={{color:"black"}}>Category: {tags}</h5>
    </div>
  </div>
  );
};

export default WatchLaterCard