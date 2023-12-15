import react, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';

import AlertDialog from "./moreInfo.jsx"
import { collection,getDocs,doc,getDoc,setDoc,updateDoc } from "firebase/firestore";
import { db,storage } from "../../firebase";
import { useAuth } from "../../context/UserAuthContext.jsx";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//ASSETS
import FileCard from "../../assets/FileAdd/fileCard.jsx"
import VideoFilePicker from '../videoTrim/videoFilePicker.jsx';
import * as helpers from "../videoTrim/utils/helpers";

//MUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//CUSTOM COMPONENTS
import CategorySelect from "./categorySelect.jsx"
import PartnerShipInfo from './parnershipInfo.jsx';
import IntroVideo from './uploadIntroFrame.jsx';
import PartnershipItem from './Partnership/Item.jsx';
import ModalPicker from './Partnership/modalPicker.jsx';
import PartnershipVideoWide from './Partnership/VideoItemWide.jsx';
import PartnershipVideo from './Partnership/VideoItem.jsx';
import PartnershipDesc from './Partnership/Description.jsx';

import PromotionOutput from './Partnership/Output/promotionOutput.jsx';
import VideoRecommendFrame from './videoRecomendFrame.jsx';

//BACKGROUND ASSETS
import outPBG1 from "../../assets/Images/outpBG-1.svg"
import outPBG2 from "../../assets/Images/outpBG-2.svg"
import outPBG3 from "../../assets/Images/outpBG-3.svg"
import WatchLaterCard from './watchLaterCard.jsx';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({passUserData,passingOwnUser,locationID,passVisitedUserData,passFollowerArray,setIsFollowed}) {


  const { currentuser } = useAuth();

  
const [userData, setUserData] = useState(null);

  const [value, setValue] = useState(0);
  const [userFile, setUserFile] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState('');

const [passOwnUser , setPassOwnUser] = useState(false)
const [visitedUserData, setVisitedUserData] = useState(null);
const [followerArray, setFollowerArray] = useState([])




  //SELECT CLIPPIFY FOLDER
  const handleChange = (event) => {
    setFolderId(event.target.value);
 
  };


  //NAVIGATIONS
const handleVideo = () => {
    window.location.href = `/creator/video/${locationID}`;
};

const handleCommunity = () => {
    window.location.href = `/creator/community/${locationID}`;

};


//FODLERDATA CLIPPIFY
const fetchData = async () => {
  if (!currentuser) {
    setFolders([]);
    return console.log("fetching data NONE")
  }
  console.log("fetching data")
  // USER ID & FIRESTORE REF
  const currentUserId = currentuser.uid;
  const colRef = collection(db, "users", currentUserId, "File-Storage");
  // Fetch all documents (folders) in the subcollection
  getDocs(colRef)
    .then((querySnapshot) => {
      const userFolders = [];
      querySnapshot.forEach((doc) => {
        userFolders.push({ id: doc.id, ...doc.data() });
      });
    setFolders(userFolders);
    })
    .catch((error) => {
      console.error("Error fetching user folders: ", error);
    });
};


//NAVIGATIONS
const handleClips = async() => {

  window.location.href = `/creator/clips/${locationID}`;

};


const handleUpload = () => {
    window.location.href = `/creator/upload/${locationID}`;
}
const handleLater = () => {
    window.location.href = `/creator/watch-later/${locationID}`;
}

//USER DATA
const fetchUserData = async () => {
  try {
    if (currentuser) {
      const currentUserId = currentuser.uid;
      const userDocRef = doc(db, "users", currentUserId);
      

      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        // Document exists, retrieve its data
        const elementData = docSnapshot.data();
        setUserData(elementData);
        passUserData(elementData);
      } else {
        console.log("Document does not exist.");
        setUserData(null); // Set to null or handle accordingly
      }
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

//USER VIDEO
const [userVideo, setUserVideo] = useState([]);

const fetchUserVideo = async () => {
  if(currentuser){
    const currentUserId = currentuser.uid;
    const colRef = collection(db, "users", currentUserId, "Videos");
    getDocs(colRef)
    .then((querySnapshot) => {
      const userVideos = [];
      querySnapshot.forEach((doc) => {
        userVideos.push({ id: doc.id, ...doc.data() });
      });
      setUserVideo(userVideos);
    })
    .catch((error) => {
      console.error("Error fetching user folders: ", error);
    });
  }
}

//USER WATCH LATER
const [userWatchLater, setUserWatchLater] = useState([]);


const fetcthUserWatchLater = async () => {
  if(currentuser){
    const currentUserId = currentuser.uid;
    const colRef = collection(db, "users", currentUserId, "Watch-Later");
    getDocs(colRef)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc2) => {
        const videoId = doc2.data().id
        const videoRef = doc(db, "videos",videoId);
        getDoc(videoRef).then((docc) => {
          if (docc.exists()) {
            // Document exists, retrieve its data
            const elementData = docc.data();
            setUserWatchLater((userWatchLater) => [...userWatchLater, elementData]);
          } else {
            console.log("Document does not exist.");
            setUserWatchLater(null); // Set to null or handle accordingly
          }
        })
    
      });
     
    
    })
    .catch((error) => {
      console.error("Error fetching user folders: ", error);
    });
  }

}

//VISITED USER DATA
const fetchVisitedData = async () => {
  try {
    if (locationID) {
      const currentUserId = locationID;
      const userDocRef = doc(db, "users", currentUserId);
      

      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        // Document exists, retrieve its data
        const elementData = docSnapshot.data();
        setVisitedUserData(elementData);
        passVisitedUserData(elementData);
       
      } else {
        console.log("Document does not exist.");
        setVisitedUserData(null); // Set to null or handle accordingly
      }
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }

}

//VISITED USER VIDEO
const [visitedUserVideo, setVisitedUserVideo] = useState([]);

const fetchVisitedVideo = async () => {
  if(locationID){
    const currentUserId = locationID;
    const colRef = collection(db, "users", currentUserId, "Videos");
    getDocs(colRef)
    .then((querySnapshot) => {
      const userVideos = [];
      querySnapshot.forEach((doc) => {
        userVideos.push({ id: doc.id, ...doc.data() });
      });
      setVisitedUserVideo(userVideos);
    })
    .catch((error) => {
      console.error("Error fetching user folders: ", error);
    });
  }
}


const fetchFollowers = async (uploader) => {
  if(currentuser){
  const followerRef = collection(db, "users", uploader,"Followers");
  const followerSnap = await getDocs(followerRef);
  const followerList = followerSnap.docs.map(doc => doc.data());
  setFollowerArray(followerList)
  passFollowerArray(followerList)

  const userRef = doc(db, "users", uploader);
  await updateDoc(userRef, {
     followers: followerList.length
  });

  if (followerList.some(follower => follower.id === currentuser.uid)) {
     setIsFollowed(true)
  }


 }
}

useEffect(() => {
  if(currentuser){
    if(currentuser.uid === locationID){
      fetchUserVideo()
      fetchUserData()
      fetcthUserWatchLater()
      fetchFollowers(currentuser.uid)
      setPassOwnUser(true)
      passingOwnUser(true)

      if(location.pathname === `/creator/video/${locationID}` && location.pathname === `/creator/${locationID}`){
        setValue(0);
      }else if(location.pathname === `/creator/community/${locationID}`){
        setValue(1);
      }else if (location.pathname === `/creator/clips/${locationID}`){
        setValue(2);
        fetchData()
      }else if(location.pathname === `/creator/upload/${locationID}`){
        setValue(3);
      }else if(location.pathname === `/creator/watch-later/${locationID}`){
        setValue(4);
      }
    }else{
      if(location.pathname === `/creator/video/${locationID}` && location.pathname === `/creator/${locationID}`){
        setValue(0);
      }else if(location.pathname === `/creator/community/${locationID}`){
        setValue(1);
      }else if (location.pathname === `/creator/clips/${locationID}`){
        setValue(2);
        fetchData()
      }else if(location.pathname === `/creator/upload/${locationID}`){
        setValue(3);
      }else if(location.pathname === `/creator/watch-later/${locationID}`){
        setValue(4);
      }
      fetchFollowers(locationID)
      setPassOwnUser(false)
      passingOwnUser(false)
      fetchVisitedData()
      fetchVisitedVideo()
    }
  }else{
    if(location.pathname === `/creator/video/${locationID}` && location.pathname === `/creator/${locationID}`){
      setValue(0);
    }else if(location.pathname === `/creator/community/${locationID}`){
      setValue(1);
    }else if (location.pathname === `/creator/clips/${locationID}`){
      setValue(2);
      fetchData()
    }else if(location.pathname === `/creator/upload/${locationID}`){
      setValue(3);
    }else if(location.pathname === `/creator/watch-later/${locationID}`){
      setValue(4);
    }
    fetchFollowers(locationID)

    setPassOwnUser(false)
    passingOwnUser(false)
    fetchVisitedData()
    fetchVisitedVideo()
  }

 
    
}, [currentuser]);


useEffect(() => {
  if (!currentuser) {
    // No user is logged in, clear the folders
    setUserFile([]);
    return;
  };
  if(folderId != ""){
  //USER ID & STORAGE REF
  const currentUserId = currentuser.uid;
  const urlID = folderId; 
  const colRef = collection(db, "users", currentUserId, "File-Storage",urlID,"Files");
  //FETCH AND DISPLAY FOLDER ELEMENTS
  getDocs(colRef)
  .then((querySnapshot) => {
    const userFiles = [];
    querySnapshot.forEach((doc) => {
        userFiles.push({ id: doc.id, ...doc.data() });
    });
    setUserFile(userFiles);
  })
  .catch((error) => {
    console.error("Error fetching user folders: ", error);
  });
}

  // Call fetchData

}, [folderId]);

const [inputVideoFile, setInputVideoFile] = useState(null);
const [userVideoURL, setUserVideoURL] = useState(null);
const [videoMeta, setVideoMeta] = useState(null);

const [inputIntroFile, setInputIntroFile] = useState(null);
const [IntroURL, setIntroURL] = useState(null);
const [introMeta, setIntroMeta] = useState(null);

const handleInputVideo = async (e) => {
  const file = e.target.files[0];
  console.log(file);
  setInputVideoFile(file);
  setUserVideoURL(await helpers.readFileAsBase64(file));
}

const handleInputIntro = async (e) => {
  const file = e.target.files[0];
  console.log(file);
  setInputIntroFile(file);
  setIntroURL(await helpers.readFileAsBase64(file));
}

const handleLoadedData = async (e) => {
  const el = e.target;
  const meta = {
    name: inputVideoFile.name,
    duration: el.duration,
    videoWidth: el.videoWidth,
    videoHeight: el.videoHeight,
  };
  console.log({ meta });
  setVideoMeta(meta);

};

const handleLoadedDataIntro = async (e) => {
  const el = e.target;
  const meta = {
    name: inputVideoFile.name,
    duration: el.duration,
    videoWidth: el.videoWidth,
    videoHeight: el.videoHeight,
  };
  console.log({ meta });
  setIntroMeta(meta);

};


const [thubnailUrl, setThubnailUrl] = useState("")
const [thubnailVideoFile, setThubnailVideoFile] = useState(null)

const handleThubnail = (e) => {
  setThubnailUrl(URL.createObjectURL(e.target.files[0]))
  setThubnailVideoFile(e.target.files[0])
}


const [pickedBackground, setPickedBackground] = useState(null)

//LOGIC TO CATEGORY
const [category, setCategory] = useState('');
const [videoTitle, setVideoTitle] = useState('');
const [videoDesc, setVideoDesc] = useState('');

const handleVideoTitle = (e) => {
  setVideoTitle(e.target.value)
}



const handleVideoDesc = (e) => {
  setVideoDesc(e.target.value)
}

//LOGIC TO PARTNERSHIP
const [pickedOne, setPickedOne] = useState(0);
const [pickedTwo, setPickedTwo] = useState(0);
const [pickedThird, setPickedThird] = useState(0);


//OUTPUT DATA
const [addedItemLink1, setAddedItemLink1] = useState("")
const [addedItemLink2, setAddedItemLink2] = useState("")
const [addedItemLink3, setAddedItemLink3] = useState("")


const [addedItemName1, setAddedItemName1] = useState("")
const [addedItemName2, setAddedItemName2] = useState("")
const [addedItemName3, setAddedItemName3] = useState("")


const [addedItemPictureURL1, setAddedItemPictureURL1] = useState("")
const [addedItemPictureURL2, setAddedItemPictureURL2] = useState("")
const [addedItemPictureURL3, setAddedItemPictureURL3] = useState("")

const [loadingScreen, setLoadingScreen] = useState(false)

const handleUploadVideo = async () => {
  setLoadingScreen(true)
  if(inputVideoFile != null && currentuser){
    const videoUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const introUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const thubnailUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const userRef = doc(db, "users", currentuser.uid,"Videos",videoUID);
    const videoRef = doc(db, "videos",videoUID);
    const storageRef = ref(storage, `podcasts/${videoUID}/${videoUID}`);
    const storageThumbRef = ref(storage, `podcasts/${videoUID}/thubnail/${thubnailUID}`);
    const storageintroRef = ref(storage, `podcasts/${videoUID}/intro/${introUID}`);
    console.log("Your Video is going to be analysed and uploaded ! If successful you will see it in your Video tab.")
    await uploadBytes(storageRef, inputVideoFile)
    console.log("uploaded video")
    await uploadBytes(storageintroRef, inputIntroFile)
    console.log("uploaded intro")
    await uploadBytes(storageThumbRef, thubnailVideoFile)
    console.log("uploaded thubnail")
    const url =  await getDownloadURL(storageRef)
    const intro =  await getDownloadURL(storageintroRef)
    const thubnailURL =  await getDownloadURL(storageThumbRef)

        setDoc(userRef, {
          video: url,
          id: videoUID,
          video_category: category,
          title: videoTitle,
          description: videoDesc,
          thubnail: thubnailURL,
          intro: intro,
          uploader_id: currentuser.uid,
          uploader_fullname: userData.fullname,
          uploader_avatar: userData.profilePictureURL,
          length: videoMeta.duration,
          created_date: new Date().getDate(),
          created_time: new Date().getTime(),
          views: 0,
        });
        setDoc(videoRef, {
          video: url,
          id: videoUID,
          video_category: category,
          title: videoTitle,
          description: videoDesc,
          thubnail:thubnailURL,
          intro: intro,
          uploader_id: currentuser.uid,
          uploader_fullname: userData.fullname,
          uploader_avatar: userData.profilePictureURL,
          length: videoMeta.duration,
          created_at: new Date(),
          views: 0,
        });
        alert("Video Uploaded")


  }
}

  return (
    <Box sx={{paddingLeft:12, width: '100%',background:"white" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} aria-label="basic tabs example">
          <Tab onClick={handleVideo} label="Videos" {...a11yProps(0)} />
          <Tab onClick={handleCommunity} label="Community" {...a11yProps(1)} />
          {passOwnUser === true ? (
            <Tab onClick={handleClips} label="Saved Clips" {...a11yProps(2)} />
          ):null
          }
          {passOwnUser ? (
                  <Tab onClick={handleUpload} label="Upload" {...a11yProps(3)} />
          ):null}

          {passOwnUser ? (
            <Tab onClick={handleLater} label="Watch Later" {...a11yProps(4)} />
            ):null}
        
      
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
  

         <div className="recommend-container" style={{marginTop:30,marginBottom:100,justifyContent:"flex-start",maxWidth:"100%",flexWrap:"wrap",height:"100%"}}>
            {passOwnUser  ? (
            userVideo.map((video) => (
              userData.length !== 0 ? (
              <VideoRecommendFrame videoID={video.id} videoTitle={video.title} videoThubnail={video.thubnail} videoIntro={video.intro} userAvatar={userData.profilePictureURL} userFullName={userData.fullname} />
              ):null
            ))
            ):(
              visitedUserVideo.map((video) => (
                <VideoRecommendFrame videoID={video.id} videoTitle={video.title} videoThubnail={video.thubnail} videoIntro={video.intro} userAvatar={visitedUserData.profilePictureURL} userFullName={visitedUserData.fullname} />
              ))
            )}
   
            
         
         </div>

      </CustomTabPanel>


      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>


      <CustomTabPanel value={value} index={2}>
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:300}}>
        <InputLabel id="demo-simple-select-label">Folder</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={folderId}
          label="Age"
          onChange={handleChange}
        >
           {folders.map((folder) => (
          <MenuItem key={folder.id} value={folder.id}>
          {folder.title}
        </MenuItem>
              ))}
      
        </Select>
      </FormControl>
    </Box>
        <div>
        <h5 style={{fontWeight:500,opacity:0.8,textAlign:"right"}}>To Add & Organise Clips <br />
        <a href="https://clippify.net/memory">Click Here</a> <br />Log in With The Same Email & Password
        </h5>
        <AlertDialog />
        </div>
       
        </div>
      <div className="file-map-container" style={{display:"flex",flexDirection:"column"}}>
  {userFile.length === 0 ? (
    <div className="no-doc" style={{marginTop:100,paddingBottom:500}}>No Clips added</div>
  ) : (
    userFile.map((file) =>
      file && file.id ? (
        <div key={file.id}>
          <Link to={`https://clippify.net/folder/${folderId}/${file.id}`}>
            {file && file.img && file.title && (
              <FileCard imgSrc={file.img} imgAlt="file img" title={file.title} tags={file.tag} related_count={file.related_count} video_size={file.video_size}/>
            )}
          </Link>
        </div>
      ) : null
    )
  )}
</div>
        
      </CustomTabPanel>

      
      <CustomTabPanel value={value} index={3}>
        <div style={{display:"flex",flexDirection:"column"}}>

          {/*UPLOAD INPUTS*/}
            <div className='first-section-upload' >
              <div style={{width:300,height:300}}>
              <VideoFilePicker
            handleChange={handleInputVideo}
            showVideo={!!inputVideoFile}
           
         
          >
            <div style={{width:445,height:300,maxHeight:250,borderRadius:20}}>
              <video
                src={inputVideoFile ? userVideoURL : null}
                autoPlay
                controls
                muted
                onLoadedMetadata={handleLoadedData}
                width="450"
                height="250"
         
                            
              ></video>
            </div>
          </VideoFilePicker>
              </div>

              <div className='texfield-container-upload' >
              <TextField id="outlined-basic" sx={{width:600}} required label="Title" variant="outlined" onChange={handleVideoTitle} />
              <TextField  id="outlined-multiline-static" sx={{width:600,marginTop:5,whiteSpace:"pre-line"}} label="Description" onChange={handleVideoDesc} variant="outlined" multiline rows={7} />
              </div>
          
            </div>

         {/*CUSTOMISATIOn*/}
            <div style={{display:"flex",flexDirection:"column",alignContent:"center",marginTop:20}}>
              <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                <div style={{marginRight:10}}>
                  <h6 style={{opacity:0.6,fontWeight:500}}>Optional for better experience</h6>
                <h2 style={{fontWeight:600}}>*Customisation</h2>
                </div>
            
              <hr style={{ width: "100%",height:1, backgroundColor: "black", border: "none"  }} />
              </div>
              <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly", alignItems:"center"}}>
                {/*CATEGORY*/}
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",height:130,width:400}}>
                  <div>
                  <h6 style={{fontWeight:400,opacity:0.6}}>Pick an Area - *</h6>
                  <h4>Select Category</h4>
                  </div>
                  <CategorySelect passCategory={setCategory} />
                </div>
                <hr style={{width:1,height:200}} />
                
                {/*THUBNAIL*/}
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",height:130,width:400,marginTop:40}}>
                <div>
                  <h6 style={{fontWeight:400,opacity:0.6}}>Shows up for users - *</h6>
                  <h4>Add Thubnail</h4>
                  </div>
                  <input type="file" onChange={handleThubnail} style={{marginTop:10}}/>
                  {thubnailUrl.length > 0 ?
                  <img src={thubnailUrl} style={{width:300,height:170,borderRadius:10,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="Thubnail" />:null
                  }
             
                </div>
                <hr style={{width:1,height:200}} />
                {/*INTRO VIDEO*/}
                <div style={{width:400,height:130,marginBottom:40}}>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly"}}>
                  <h6 style={{fontWeight:400,opacity:0.6}}>Shows up in fyp - *</h6>
                  <h4>Add Intro</h4>
                  </div>
                  <IntroVideo
            handleChange={handleInputIntro}
            showVideo={!!inputIntroFile}
          
         
          >
            <div style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",width:250,height:100,borderRadius:20,marginTop:10}}>
              <video
                src={inputIntroFile ? IntroURL : null}
                autoPlay
                controls
                muted
                onLoadedMetadata={handleLoadedDataIntro}
                width="300"
                            
              ></video>
            </div>
          </IntroVideo>
                </div>
              </div>
      
            </div>

              {/*PARTNERSHIP*/}
          <div style={{display:"flex",flexDirection:"column",alignContent:"center",marginTop:50}}>

            {/*TITLE*/}
              <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

    
              <div style={{marginRight:10}}>
              <PartnerShipInfo />
              </div>

         
              <div style={{marginRight:10}} > 
                <h6 style={{opacity:0.6,fontWeight:500}}>Optional</h6>
                <h2 style={{fontWeight:600}}>Partnership</h2>
              </div>
       
              <hr style={{ width: "100%",height:1, backgroundColor: "black", border: "none"  }} />
          
              </div>

            <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>

              {/*PROMOTION STYLE INPUTS*/} 
                <div className='inputs-promotion' style={{height:800,display:"flex",flexDirection:"column",width:"60%",justifyContent:"space-evenly"}}>

                  {/*ITEM 1*/} 
                  <div >
                  <ModalPicker pickedOne={setPickedOne} />
                  <h2>1.) Item</h2>
                  {pickedOne === 1 ?(
                     <PartnershipItem compAddedItemName1={setAddedItemName1} compAddedItemLink1={setAddedItemLink1} compAddedItemPictureURL1={setAddedItemPictureURL1} />
                  ):pickedOne === 2 ?(
                    <PartnershipVideoWide compAddedItemName1={setAddedItemName1} compAddedItemLink1={setAddedItemLink1} compAddedItemPictureURL1={setAddedItemPictureURL1}/>
                  ):pickedOne === 3 ?(
                    <PartnershipVideo compAddedItemPictureURL1={setAddedItemPictureURL1} compAddedItemLink1={setAddedItemLink1} />
                  ):pickedOne === 4 ?(
                    <PartnershipDesc compAddedItemName1={setAddedItemName1} compAddedItemLink1={setAddedItemLink1} />
                  ):null
                  }
               
           
                  </div>
                 <hr style={{borderStyle:"groove"}} />
                {/*ITEM 2*/}
                  <div>
                  <ModalPicker pickedOne={setPickedTwo} />
                  <h2>2.) Item</h2>
                  {pickedTwo === 1 ?(
                     <PartnershipItem compAddedItemName1={setAddedItemName2} compAddedItemLink1={setAddedItemLink2} compAddedItemPictureURL1={setAddedItemPictureURL2} />
                  ):pickedTwo === 2 ?(
                    <PartnershipVideoWide compAddedItemName1={setAddedItemName2} compAddedItemLink1={setAddedItemLink2} compAddedItemPictureURL1={setAddedItemPictureURL2}/>
                  ):pickedTwo === 3 ?(
                    <PartnershipVideo compAddedItemPictureURL1={setAddedItemPictureURL2} compAddedItemLink1={setAddedItemLink2}/>
                  ):pickedTwo === 4 ?(
                    <PartnershipDesc compAddedItemName1={setAddedItemName2} compAddedItemLink1={setAddedItemLink2} />
                  ):null
                  }
                  </div>
                <hr style={{borderStyle:"groove"}} />
                {/*ITEM 3*/}
                  <div>
                  <ModalPicker pickedOne={setPickedThird} />
                  <h2>3.) Item</h2>
                  {pickedThird === 1 ?(
                     <PartnershipItem compAddedItemName1={setAddedItemName3} compAddedItemLink1={setAddedItemLink3} compAddedItemPictureURL1={setAddedItemPictureURL3} />
                  ):pickedThird === 2 ?(
                    <PartnershipVideoWide compAddedItemName1={setAddedItemName3} compAddedItemLink1={setAddedItemLink3} compAddedItemPictureURL1={setAddedItemPictureURL3}/>
                  ):pickedThird === 3 ?(
                    <PartnershipVideo compAddedItemPictureURL1={setAddedItemPictureURL3} compAddedItemLink1={setAddedItemLink3} />
                  ):pickedThird === 4 ?(
                    <PartnershipDesc compAddedItemName1={setAddedItemName3} compAddedItemLink1={setAddedItemLink3} />
                  ):null
                  }
              
                  </div>

              {/*BACKGROUND SELECT*/}
                  <div>
                    <div style={{display:"flex",flexDirection:"row",width:"60%",justifyContent:"space-evenly"}}>
                    <img onClick={() => setPickedBackground(outPBG1)} src={outPBG1} style={{width:100,height:100,cursor:"pointer"}} alt="1" />
                    <hr />
                    <img onClick={() => setPickedBackground(outPBG2)} src={outPBG2} style={{width:100,height:100,cursor:"pointer"}} alt="2" />
                    <hr />
                    <img onClick={() => setPickedBackground(outPBG3)} src={outPBG3} style={{width:100,height:100,cursor:"pointer"}} alt="3" />
                    </div>
                  </div>
              
                </div> 
           
              {/*PROMOTION STYLE OUTPUTS*/} 
                <div style={{border:"0px solid black",width:300,display:"flex",flexDirection:"column",justifyContent:"space-evenly",  backgroundImage: `url(${pickedBackground})`,backgroundSize: "cover",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>

                <PromotionOutput picked={pickedOne} addedItemLinkFirst={addedItemLink1} addedItemNameFirst={addedItemName1} addedItemPictureURLFirst={addedItemPictureURL1} />
        

              <PromotionOutput picked={pickedTwo} addedItemLinkFirst={addedItemLink2} addedItemNameFirst={addedItemName2} addedItemPictureURLFirst={addedItemPictureURL2} />

             
              <PromotionOutput picked={pickedThird} addedItemLinkFirst={addedItemLink3} addedItemNameFirst={addedItemName3} addedItemPictureURLFirst={addedItemPictureURL3} />
                  

              </div>
            </div>

            
     
        </div>
       
       <div style={{display:"flex",flexDirection:"row"}}>
       <hr style={{height:1,width:"30%",marginTop:230,borderStyle:"double"}} />
        <div className='upload-video-btn' style={{display:"flex", flexDirection:"column",marginLeft:"auto",marginRight:"auto",marginTop:200,marginBottom:100}}>
       
          <h3 onClick={handleUploadVideo}>Upload Video</h3>
    
        </div>
        <hr style={{height:1,width:"40%",marginTop:230,borderStyle:"double"}} />
        </div>

        </div>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={4}>
      <div className="file-map-container" style={{display:"flex",flexDirection:"column"}}>
  {userWatchLater.length === 0 ? (
    <div className="no-doc" style={{marginTop:100,paddingBottom:500}}>No Video added</div>
  ) : (
    userWatchLater.map((file) =>
      file && file.id ? (
        <div key={file.id}>
          <Link to={`/${file.id}`}>
              <WatchLaterCard imgSrc={file.thubnail} imgAlt="file img" title={file.title} tags={file.video_category} related_count={file.views} video_size={file.views}/>
          </Link>
        </div>
      ) : null
    )
  )}
</div>
      </CustomTabPanel>


    </Box>
  );
}