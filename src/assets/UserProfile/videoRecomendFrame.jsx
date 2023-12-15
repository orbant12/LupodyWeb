import { Link } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import { useState } from "react"

import HoverVideoPlayer from 'react-hover-video-player';


const VideoRecomendFrame = ({
    videoID,
    videoIntro,
    videoThubnail,
    videoTitle,
    userAvatar,
    userFullName
}) => {

const [isHovered, setIsHovered] = useState(false)

const handleMouseEnter = () => {

    setIsHovered(true)
}


    return (
        <Link to={`/${videoID}`}>
        <div className="recommend-video" style={{paddingRight:20,paddingBottom:40,maxHeight:330,minHeight:330}} key={videoID}>
          
 
      <div
      style={{ position: 'relative', width: '350px', height: '200px',overflow: 'hidden',cursor:"pointer" }}
      >
 
        <HoverVideoPlayer
          
   
          videoSrc={videoIntro}
          pausedOverlay={
              <img
              src={videoThubnail} // Replace with the actual thumbnail URL property
              alt="Video Thumbnail"
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover' ,borderRadius: 10,boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',background:"black",opacity: 1,transition: 'opacity 0.3s ease-in-out'}}
            />
          }
          crossOrigin="anonymous"
          loadingOverlay={
            <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
          }
          videoStyle={{
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
            border:"1px solid black",
            opacity: 1, // Set the opacity to 1 when video is hovered
            transition: 'opacity 0.3s ease-in-out', // Add transition for smooth effect
            crossOrigin: 'anonymous'
          }}
          
         />
     
    </div>
   
        <div style={{display:"flex",flexDirection:"row",width:300,justifyContent:"left",marginLeft:10,marginTop:10,maxHeight:85,minHeight:85,color:"black"}}>
           <Avatar src={userAvatar} imgProps={{crossOrigin: 'anonymous'}}/>
           <div style={{ maxWidth: 290,minHeight:140 ,maxHeight: 140 ,marginLeft:20}}>
           <h4 style={{margin: 0, lineHeight: "30px", textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}}>{videoTitle}</h4>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",width:330,opacity:0.6}}>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",minWidth:200,maxWidth:220}}>
            <h6 style={{fontWeight:500,minWidth:70,maxWidth:100, overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',}}>{userFullName}</h6>
            <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <h6 style={{minWidth:10,maxWidth:10}}>-</h6>
            <h6 style={{minWidth:70,maxWidth:70}}>4 hours ago</h6>
            </div>
     
            </div>
  
              <h5 style={{fontWeight:500,minWidth:100,maxWidth:100}}>4 M V</h5>
          </div>
         
           </div>
          
        </div>
     </div>
</Link>
    )
}

export default VideoRecomendFrame