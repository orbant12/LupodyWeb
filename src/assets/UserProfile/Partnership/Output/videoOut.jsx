
import { Link } from "react-router-dom";

const VideoOut = ({
    addedItemLink,
    addedItemPictureURL
}) => {

    return(
        <div style={{height:530}}>
 
        <Link to={addedItemLink} title="Link To The Product !">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:300,marginLeft:"auto",marginRight:"auto",height:180,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 10px"}}>
        {addedItemPictureURL.length > 0 ?

        <div>
        <video crossOrigin="anonymous" autoPlay controls muted style={{width:300,height:535,borderRadius:0}}>
        <source src={addedItemPictureURL} type="video/mp4" crossOrigin="anonymous" />
        </video>
        </div>:null
      }
        </div>
        </Link>
  
      </div>
    )
}

export default VideoOut