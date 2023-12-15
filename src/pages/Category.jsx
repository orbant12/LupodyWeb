//CSS
import "../Css/login.css"

import "../Css/styles.css"

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuth } from "../context/UserAuthContext.jsx";

import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit, limitToLast, startAfter, endBefore, where } from "firebase/firestore";
import {db} from "../firebase"
import VideoRecomendFrame from "../assets/UserProfile/videoRecomendFrame.jsx"

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


import Box from '@mui/material/Box';

//REACT
import React, {useState,useEffect} from "react"

//ASSETS AND IMAGES AND ICONS

import SearchIcon from '@mui/icons-material/Search';
import "../Css/userPage.css"

import science from "../Assets/Images/category_5.svg"
import news from "../Assets/Images/category_4.svg"
import comedy from "../Assets/Images/category_2.svg"
import solo from "../Assets/Images/category_1.svg"
import talking from "../Assets/Images/category_3.svg"
import fitness from "../Assets/Images/category_7.svg"
import health from "../Assets/Images/category_8.svg"
import game from "../Assets/Images/game-cat-fix.svg"
import sports from "../Assets/Images/sport-test-3.svg"
import tech from "../Assets/Images/12.svg"

const CategoryPage = () => {

const { id } = useParams();
const { currentuser } = useAuth();
const [isThubnail, setIsThubnail] = useState(false)
const [userData, setUserData] = useState([])
const [thubnailTheme, setThubnailTheme] = useState(null)

//MOST LIKED
const [preLoadedMostLiked, setPreLoadedMostLiked] = useState([])
const [lastMostLiked, setLastMostLiked] = useState(null)
const [firstMostLiked, setFirstMostLiked] = useState(null)

const [positionThubnail, setPositionThubnail] = useState("-250px")



//Fetch Most Liked Videos

const fetchMostLiked = async () => {
    const pageSize = 4;
    const field = "video_category";
    const ref = collection(db, "videos");
 
     const q = query(ref, orderBy(field),where(field, "==", id), limit(pageSize));
     const querySnapshot = await getDocs(q)
     //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY
 
     const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
     const firstVisible = querySnapshot.docs[0];
     setLastMostLiked(lastVisible);
     setFirstMostLiked(firstVisible);
     setPreLoadedMostLiked(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
     console.log("FIRST DOCUMENT",firstVisible)
     console.log("LAST DOCUMENT",lastVisible)
     console.log("PRELOADED VIDEOS",preLoadedVideos)
}


const handleNextMostLiked = async () => {
       //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),where(field, "==", id),startAfter(lastMostLiked), limit(pageSize));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastMostLiked(lastVisible);
      setFirstMostLiked(firstVisible);
      setPreLoadedMostLiked(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
}

const handlePrevMostLiked = async () => {
    //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
const pageSize = 4;
const field = "video_category";
const ref = collection(db, "videos");

 const q = query(ref, orderBy(field),where(field, "==", id),endBefore(firstMostLiked), limitToLast(pageSize));
   const querySnapshot = await getDocs(q)
   const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
   const firstVisible = querySnapshot.docs[0];
   setLastMostLiked(lastVisible);
   setFirstMostLiked(firstVisible);
   setPreLoadedMostLiked(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
}

useEffect(() => {
    fetchMostLiked()
    if (id == "Health"){
        setThubnailTheme(health)
    }else if(id == "Science"){
        setThubnailTheme(science)
        setPositionThubnail("-110px")
    }else if(id == "News"){
        setThubnailTheme(news)
        setPositionThubnail("-300px")
    }else if(id == "Comedy"){
        setThubnailTheme(comedy)
        setPositionThubnail("-50px")
    }else if(id == "Solo"){
        setThubnailTheme(solo)
        setPositionThubnail("-360px")
    }else if(id == "Gaming"){
        setThubnailTheme(game)
        setPositionThubnail("-360px")
    }else if(id == "Fitness"){
        setThubnailTheme(fitness)
        setPositionThubnail("-330px")
    }else if(id == "Talking"){
        setThubnailTheme(talking)
    }else if(id == "Sports"){
        setThubnailTheme(sports)
        setPositionThubnail("-250px")
    }else if(id == "Tech"){
        setThubnailTheme(tech)
        setPositionThubnail("-385px")
    }
    
}, [])

const [age, setAge] = useState('');

const handleChange = (event) => {
  setAge(event.target.value);
};



return(

<div className="home">
      {/*NAV HEADER*/}


      {/*USER CUSTOM DATA*/}
      <div className="f-row-user">

     
            <img src={thubnailTheme} crossOrigin="anonymus" style={{ objectFit: "cover",objectPosition:`0px ${positionThubnail}`,border:"none",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="user-picture" className="thubnail" />
 
          
    

      </div>


        {/*Videos*/}

        <div className="recommend-section" >
            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",marginBottom:0,marginTop:100,alignItems:"center",height:150}}>
            <h1 >{id}</h1>

            <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:150}}>
        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
      
        <MenuItem value={"default"}>Lupody's Sorting</MenuItem>
          <MenuItem value={20}>Most Liked</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        
      
        </Select>
      </FormControl>
    </Box>
            </div>
         
      <hr style={{marginTop:40,borderStyle:"groove"}} />
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop:40}}>
      <h1>Others favorite</h1>

      </div>
         <div className="recommend-container" >
            <div onClick={handlePrevMostLiked} style={{ cursor: "pointer", transform: "rotate(180deg)",marginBottom:100}}
>
            <ArrowCircleRightIcon  />
            </div>
    
  {preLoadedMostLiked.length > 2 ? (
   preLoadedMostLiked.map((video) => (
    <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
 ))
  ):(
    <div>
    <h3 style={{opacity:0.3,paddingBottom:80}}>Not Enough Video Uploaded</h3>
 </div>
  )}
      
           
           <div onClick={handleNextMostLiked} style={{cursor: "pointer",marginBottom:100}}>
            <ArrowCircleRightIcon  />
            </div>
         </div>

         <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop:0}}>
      <h1>On Fire Right Now</h1>

      </div>
         <div className="recommend-container" >
            <div onClick={handlePrevMostLiked} style={{ cursor: "pointer", transform: "rotate(180deg)",marginBottom:100}}
>
            <ArrowCircleRightIcon  />
            </div>
    
        {preLoadedMostLiked.length > 2 ? (
          preLoadedMostLiked.map((video) => (
            <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
         ))
         ):(
            <div>
            <h3 style={{opacity:0.3,paddingBottom:80}}>Not Enough Video Uploaded</h3>
          </div>
         )}
           
           <div onClick={handleNextMostLiked} style={{cursor: "pointer",marginBottom:100}}>
            <ArrowCircleRightIcon  />
            </div>
         </div>

         
      </div>

 

   


</div>

)
}

export default CategoryPage