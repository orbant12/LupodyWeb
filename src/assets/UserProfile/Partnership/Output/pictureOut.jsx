
import { Link } from "react-router-dom";

const PictureOut = ({
    addedItemLink,
    addedItemName,
    addedItemPictureURL
}) => {

    return(
        <div style={{marginBottom:20}}>
        <div style={{display:"flex",flexDirection:"row"}}>
        <h2 className='partner-item-title'>{addedItemName}</h2>
        {addedItemName.length > 0 ? 
        <hr style={{width: "100%",height:1, backgroundColor: "black", border: "none",marginTop:20}}  />:null
      }
        </div>
 
      <Link to={addedItemLink}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:180,marginLeft:"auto",marginRight:"auto",height:180}}>
        {addedItemPictureURL.length > 0 ?
        <img style={{width:180,height:180,borderRadius:5,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} src={addedItemPictureURL} alt="Item Picture" />:null
      }
        </div>
      </Link>
      </div>
    )
}

export default PictureOut