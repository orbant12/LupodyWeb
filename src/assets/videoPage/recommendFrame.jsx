
import { Link} from "react-router-dom";
import { useState } from "react"
import HoverVideoPlayer from 'react-hover-video-player';

const RecommendFrame = ({
    videoID,
    videoIntro,
    videoThubnail,
    videoTitle,
    uploader_fullname
}) => {

const [isHovered, setIsHovered] = useState(false)


const handleMouseEnter = () => {

    setIsHovered(true)
}

const handleNavigation = async() => {
   window.location.href = `/${videoID}`
}
const handleReload = () => {
    window.location.reload()
}

const handleUserNavigation = async() => {
  await handleNavigation()
  handleReload()
}




    return (
        <Link to={`/${videoID}`} onClick={handleUserNavigation}>
         <div className="recommend-video" style={{paddingRight:20,paddingBottom:20,maxHeight:260,minHeight:260}} key={videoID}>
          
 
          <div
    
          style={{ position: 'relative', width: '250px', height: '150px',cursor:"pointer"}}
          >
   
          <HoverVideoPlayer
          
   
          videoSrc={videoIntro}
          pausedOverlay={
            <img
            src={videoThubnail} // Replace with the actual thumbnail URL property
            alt="Video Thumbnail"
            crossOrigin='anonymus'
            style={{ width: '100%', height: '100%', objectFit: 'cover' ,borderRadius: 10,background:"black",opacity: 1,transition: 'opacity 0.3s ease-in-out'}}
          />
          }
          crossOrigin="anonymous"
          loadingOverlay={
            <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
          }
          videoStyle={{
            
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 5,
            border:"1px solid black",
            opacity: 1, // Set the opacity to 1 when video is hovered
            transition: 'opacity 0.3s ease-in-out' // Add transition for smooth effect
          }}
          
         />
       
         

       
       
           <div style={{ maxWidth: 200, maxHeight: 140, overflow: "hidden" ,marginLeft:10,marginTop:10, minHeight:140,color:"black"}}>
           <h4 style={{margin: 0, lineHeight: "30px", textOverflow: "ellipsis", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"}}>{videoTitle}</h4>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
          <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",minWidth:200,maxWidth:220,opacity:0.6}}>
          <h6 style={{fontWeight:500,minWidth:70,maxWidth:100, overflow: 'hidden',textOverflow: 'ellipsis',whiteSpace: 'nowrap',}}>{uploader_fullname}</h6>
            <div style={{width:"100%",display:"flex",flexDirection:"row"}}>
            <h6 style={{minWidth:10,maxWidth:10}}>-</h6>
            <h6 style={{minWidth:70,maxWidth:70}}>4 hours ago</h6>
            </div>
            </div>
          <h5 style={{fontWeight:500,fontSize:11,minWidth:100,maxWidth:100,marginLeft:-20}}>4 M</h5>
          </div>
    
          
        </div>
     </div>
     </div>
     </Link>
    )
}

export default RecommendFrame