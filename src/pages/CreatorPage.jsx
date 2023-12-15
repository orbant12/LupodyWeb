//CSS
import "../Css/login.css"

import "../Css/styles.css"

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Avatar from '@mui/material/Avatar';
import BasicTabs from "../assets/creatorPage/tabSelect.jsx"
import { useAuth } from "../context/UserAuthContext.jsx";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import creatorPageImage from "../Assets/Images/creatorPage.svg"
//REACT
import React, {useState} from "react"

//ASSETS AND IMAGES AND ICONS


import "../Css/userPage.css"

const CreatorPage = () => {

const { currentuser } = useAuth();

const [userData, setUserData] = useState([])






return(

<div className="home">
      {/*NAV HEADER*/}


      {/*USER CUSTOM DATA*/}
      <div className="f-row-user">

    
    <img src={creatorPageImage} crossOrigin="anonymus" style={{ objectFit: "cover",border:"none",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",objectPosition:"0px -235px"}} alt="user-picture" className="thubnail" />
  
      
   
       
    
      <div className="user-custom-data" style={{alignItems:"center"}}>
  


         <div className="middle-col" style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",width:250}}>
         <Avatar imgProps={{crossOrigin: 'anonymous'}} style={{ width: 100, height: 100 }} src={userData.profilePictureURL} />
         <div className="left-col" style={{alignItems:"center",marginTop:0,height:120}}>
            <h2>{userData.fullname}</h2>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",minWidth:140,maxWidth:180}}>
            <h6>{userData.user_name} </h6>
            <h6>‧</h6>
            <h6><span>40</span> Videos</h6>
            </div>
           
         
        
      
         </div>
         </div>

        <div>
            <h1>Creator Page</h1>
        </div>

         <div style={{display:"flex",flexDirection:"column",height:100,justifyContent:"space-evenly",marginTop:30,textAlign:"center"}}>
            <h4 className="upload-btn">Need Help ?</h4>
            <h4 className="upload-btn">FAQ</h4>
         </div>
      </div>
      </div>


      <BasicTabs className="navigation-selector" passUserData={setUserData}/>
      {/*CATEGORIES SECTION*/}

</div>

)
}

export default CreatorPage