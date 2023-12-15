//CSS
import "../Css/login.css"

import "../Css/styles.css"

import Avatar from '@mui/material/Avatar';
import BasicTabs from "../assets/UserProfile/tabSelect.jsx"
import { useAuth } from "../context/UserAuthContext.jsx";
import { db, storage } from "../firebase";
import { doc, updateDoc,setDoc,deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
//REACT
import { useParams } from "react-router-dom";
import React, {useState} from "react"

//ASSETS AND IMAGES AND ICONS

import "../Css/userPage.css"

const UserPodcast = () => {

const { currentuser } = useAuth();

const [userData, setUserData] = useState([])
const [thubnailFile, setThubnailFile] = useState(null)
const {id} = useParams()

const [ownUser, setOwnUser] = useState(false)


const [visitedUserData, setVisitedUserData] = useState([])
const [passedIsFollowed, setPassedIsFollowed] = useState(false)
const [passedFollowerArray, setPassedFollowerArray] = useState([])

const handeInputThubnail = (e) => {
   setThubnailFile(e.target.files[0])
}

const handleThubnailUplaod = () => {
if(thubnailFile != null && currentuser){
   const userRef = doc(db, "users", currentuser.uid);
   const storageRef = ref(storage, `users/${currentuser.uid}/thubnail/${thubnailFile.name}`);
   uploadBytes(storageRef, thubnailFile).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(snapshot.ref).then((url) => {
         setUserData({...userData,thubnail:url})
         updateDoc(userRef, {
            thubnail: url
         });
      });
   });
}
}


const handleFollow = async () => {
   if(currentuser){
   if (passedIsFollowed === false) {
      const userRef = doc(db, "users",id,"Followers",currentuser.uid);
      const uploaderRef = doc(db, "users",currentuser.uid,"Following",id);
      await setDoc(userRef,{
         id:currentuser.uid
      })
      await setDoc(uploaderRef,{
         id: id,
      })
   
      setPassedIsFollowed(true)
   
   }else if (passedIsFollowed  === true) {
      const userRef = doc(db, "users", id,"Followers",currentuser.uid);
      const uploaderRef = doc(db, "users",currentuser.uid,"Following",id);
      if(passedFollowerArray.some(follower => follower.id === currentuser.uid)){
         await deleteDoc(userRef)
         await deleteDoc(uploaderRef)
      }
      setPassedIsFollowed(false)
   
   }
 }else{
   alert("You need to be logged in to follow")
 }
}


return(

<div className="home">
      {/*NAV HEADER*/}


      {/*USER CUSTOM DATA*/}
      <div className="f-row-user">

      {ownUser ? (
      userData.thubnail !== "" ? (
      <img src={userData.thubnail} crossOrigin="anonymus" style={{ objectFit: "cover",border:"none",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="user-picture" className="thubnail" />
):(
   <div className="thibnail-none">
       <h1>Upload Thubnail</h1>
       <input type="file" onChange={handeInputThubnail} />
       <h4 className="upload-btn" onClick={handleThubnailUplaod}>Upload</h4>
   </div>
)

      ):(
   
            <img src={visitedUserData.thubnail} crossOrigin="anonymus" style={{ objectFit: "cover",border:"none",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="user-picture" className="thubnail" />
       
      )}
        
       
    
      <div className="user-custom-data">
  
         <div className="left-col" style={{textAlign:"left",marginTop:-20,minWidth:500}}>
            <h4>Channel Description:</h4>
            {ownUser ? (
        
                       <h5 style={{maxWidth:500,fontWeight:500}}>
                {userData.description}
            </h5>
            
            ) : (
       
            <h5 style={{maxWidth:500,fontWeight:500}}>
               {visitedUserData.description}
          </h5>
    
            )}
       
         </div>
      
         {ownUser ? (
            userData.length !== 0 ? (
         <div className="middle-col" style={{display:"flex",flexDirection:"row",marginLeft:-300,justifyContent:"space-evenly",width:350}}>
         <Avatar imgProps={{crossOrigin: 'anonymous'}} style={{ width: 150, height: 150 }} src={userData.profilePictureURL} />
         <div className="left-col" style={{alignItems:"center",marginTop:20,height:120}}>
            <h2>{userData.fullname}</h2>
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",minWidth:140,maxWidth:180}}>
            <h6>{userData.user_name} </h6>
            <h6>‧</h6>
            <h6><span>40</span> Videos</h6>
            </div>
            <h4><span>{userData.followers}</span> Followers</h4>
         
        
      
         </div>
         </div>
            ):null
         ):(
            <div className="middle-col" style={{display:"flex",flexDirection:"row",marginLeft:-300,justifyContent:"space-evenly",width:350}}>
            <Avatar imgProps={{crossOrigin: 'anonymous'}} style={{ width: 150, height: 150 }} src={visitedUserData.profilePictureURL} />
            <div className="left-col" style={{alignItems:"center",marginTop:20,height:120}}>
               <h2>{visitedUserData.fullname}</h2>
               <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",minWidth:140,maxWidth:180}}>
               <h6>{visitedUserData.user_name} </h6>
               <h6>‧</h6>
               <h6><span>40</span> Videos</h6>
               </div>
               <h4><span>{visitedUserData.followers}</span> Followers</h4>
            
           
         
            </div>
            </div>
         )}

   {ownUser ? (
         <div style={{display:"flex",flexDirection:"column",height:100,justifyContent:"space-evenly",marginTop:30,alignItems:"center"}}>
            <h4 className="upload-btn" onClick={()=> window.location.href = "/creator-page"}>Creator Page</h4>
            <h4 className="upload-btn" onClick={()=> window.location.href = "/policies"}>Support</h4>
         </div>
   ):(
      <div className='follow-btn' style={{ backgroundColor: "#1DA1F2",height:35,marginTop:75 }} onClick={handleFollow} >
   
   {passedIsFollowed ? (
                  <h5 style={{fontWeight:600}}>Unfollow</h5>
               ):(
                  <h5 style={{fontWeight:600}}>Follow</h5>
               )}
   
     
   </div>

   )}
      </div>
      </div>


      <BasicTabs className="navigation-selector" passUserData={setUserData} passingOwnUser={setOwnUser} passVisitedUserData={setVisitedUserData} locationID={id} setIsFollowed={setPassedIsFollowed} passFollowerArray={setPassedFollowerArray}/>
      {/*CATEGORIES SECTION*/}

</div>

)
}

export default UserPodcast