
import { Link } from "react-router-dom";

const DescriptionOut = ({
    addedItemLink,
    addedItemName
}) => {

    return(
        <Link to={addedItemLink} title="Take me To The Product !">
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginLeft:"auto",marginRight:"auro"}}>
        <h4 className='partner-item-title'>{addedItemName}</h4>

        </div>
 

   
      </Link>
    
    )
}

export default DescriptionOut