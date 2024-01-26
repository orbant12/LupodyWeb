
import Avatar from '@mui/material/Avatar';
import React,{useState,useEffect} from 'react';
import FrameVideoFYP from "./videoFrameFYP.jsx"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const FypSection = ({
    videoId,
    videoURL,
    videoTitle,
    videoCategory,
    uploaderID,
    handleForyouNextpass,
    handleForyouPrevpass
}) => {

       //Uploader DATA
   const [uploaderName, setUploaderName] = useState("")
   const [uploaderFollowers, setUploaderFollowers] = useState(0)
   const [uploaderAvatar, setUploaderAvatar] = useState("")
  


    useEffect(() => {
        const fetchUploaderData = async (uploader) => {
            if(uploader != null){
               const uploaderRef = doc(db, "users", uploader);
               const uploaderSnap = await getDoc(uploaderRef);
               if (uploaderSnap.exists()) {
                  setUploaderName(uploaderSnap.data().fullname)
                  setUploaderFollowers(uploaderSnap.data().followers)
                  setUploaderAvatar(uploaderSnap.data().profilePictureURL)
               
               } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!");
            
               }
            
            }
         }
         fetchUploaderData(uploaderID)
    }, [,uploaderName,uploaderID])

    return (
      <div className='fyp-section-column'>
        <div className="fyp-section" key={videoId} >
     
        <div className="left-col" style={{alignItems:"center"}}>
           <div className='left-col-row' >
            <Link to={`/creator/${uploaderID}`}>
           <Avatar className='fyp-avatar' imgProps={{crossOrigin:"anonymous"}} src={uploaderAvatar}/>
           </Link>
           <div style={{display:"flex",flexDirection:"column"}}>
           <h3 style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}  >{uploaderName}</h3>
           <hr style={{width:100,height:1,marginTop:10,marginBottom:10,borderStyle:"groove"}}/>
           <h5 style={{fontWeight:500}}>{uploaderFollowers} Followers</h5>
           </div>
     
           </div>
     
 
        </div>

        <div className="middle-col">
        <div className='foryou-title' >
         <h5 style={{opacity:0.6,borderBottom:"1px groove black"}}>For You</h5>
      </div>
           <FrameVideoFYP  videoSrc={videoURL} />

  
      <div className='foryou-watchfull' >
      <Link style={{color:"black"}} to={`/${videoId}`}>
         <h5 className='watchfull-txt'>Watch Full Episode</h5>
         </Link>
      </div>
  
       
        </div>

        <div className="right-col" >
           <div className='arrow-fyp' style={{display:"flex",flexDirection:"column",height:"250px",justifyContent:"space-between",paddingTop:50,marginRight:50}}>
           <KeyboardArrowDownIcon className="down-fyp" style={{transform: 'rotate(180deg)'}} onClick={() =>  handleForyouPrevpass()}/>
           <KeyboardArrowDownIcon className="down-fyp" onClick={() => handleForyouNextpass()}/>
           </div>

           <div className="left-col2" >
           <h3 style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{videoTitle}</h3>
           <h6 style={{fontWeight:500}}>{videoCategory}</h6>
           <hr style={{marginTop:10,marginBottom:10,borderStyle:"groove"}} />
           <h3>Cast</h3>
           <h6 style={{fontWeight:500}}>Joe Rogan, John</h6>
           </div>


        </div>
 
     </div>
   </div>
    );
}

export default FypSection;