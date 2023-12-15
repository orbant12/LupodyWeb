
import { Link } from "react-router-dom";

const VideoWideOut = ({
    addedItemLink,
    addedItemName,
    addedItemPictureURL
}) => {

    return(
        <div>
        <div style={{display:"flex",flexDirection:"row"}}>
        <Link to={addedItemLink} title="Link To The Product !">
        <h2 className='partner-item-title'>{addedItemName}</h2>
        </Link>
        {addedItemName.length > 0 ? 
        <hr style={{width: "100%",height:1, backgroundColor: "black", border: "none",marginTop:20}}  />:null
      }
        </div>
    
 
 
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:180,marginLeft:"auto",marginRight:"auto",height:180}}>
        {addedItemPictureURL.length > 0 ?

        <div>
        <video crossOrigin="anonymous" autoPlay controls muted style={{width:250,height:140,borderRadius:5,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
        <source src={addedItemPictureURL} type="video/mp4" crossOrigin="anonymous" />
        </video>
        </div>:null
      }
        </div>
  
      </div>
    )
}

export default VideoWideOut