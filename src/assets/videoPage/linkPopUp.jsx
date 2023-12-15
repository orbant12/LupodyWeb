import React, {useEffect, useState} from 'react'
import VideoUrlApp from '../videoTrim/videoUrlApp'
import MultipleSelectCheckmarks from '../FileAdd/tagbar'
import ZeroWidthStack from '../FileAdd/featureSelect'
import DelayingAppearance from '../FileAdd/LoadingBtn'
import { db,storage } from '../../firebase'
import { collection,doc,setDoc,getDocs,getDoc,updateDoc } from 'firebase/firestore'
import { ref, uploadString, getDownloadURL, uploadBytes,deleteObject} from 'firebase/storage';
import { useAuth } from '../../context/UserAuthContext'
import FolderCreate from '../videoPage/folderCreation'

import Box from '@mui/material/Box';
//MUI
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {v4} from "uuid";


const LinkPopUp = ({setIsLinkpass,podcastURL}) => {

const { currentuser } = useAuth();

    const [isLinkActive, setIsLinkActive] = useState(false)
    const [isAddedOn, setIsAddedOn] = useState(false)
 
    const [fileImage, setFileImage] = useState('')
    const [metaData, setMetaData] = useState('')
    const [tag, setTag] = useState('')
    const [audioFile, setAudioFile] = useState('')
    const [trimmedVideoFile, setTrimmedVideoFile] = useState('')
    const [titleInput, setTitleInput] = useState('Untitled')
    const [folderId, setFolderId] = useState('')
    const [folders, setFolders] = useState([]);
    const [userData, setUserData] = useState([]);
    const [podcastUrl, setPodcastUrl] = useState('')


    const handleChange = (event) => {
      setFolderId(event.target.value);
   
    };
  

    const handleTitleInput = (e) => {
        setTitleInput(e.target.value)
    }
    

    const pickedPopup = () => {
        setIsLinkActive(true)
        setIsLinkpass(false)
    }

    const createFile = async () => {
      if (currentuser && metaData.videoDuration < 10 && userData.subscription == false) {
        const currentUserId = currentuser.uid;
        const docRef = collection(db, "users", currentUserId, "File-Storage",folderId,"Files");
        const userRef = doc(db,"users",currentUserId)
        const folderFiles = doc(docRef)
        // STORAGE
        const audioMetadata = {
          contentType: 'audio/mp3',
        };
        // FILE NAME
        const allName = `${v4() + metaData.videoName}`
        const metaName = `videos/${allName}`
        const audioName = `audio/${allName}`
        // PATH NAME
        const storagePathVideo = `${"users"+ "/" + currentuser.uid + "/" + folderId + "/" + folderFiles.id + "/" + metaName}`;
        const storagePathAudio = `${"users"+ "/" + currentuser.uid + "/" + folderId + "/" + folderFiles.id + "/" + audioName}`;
        // STORAGE REF
        const videoRef = ref(storage, storagePathVideo);
        const audioRef = ref(storage, storagePathAudio);
        // UPLOAD TO STORAGE
        await uploadString(videoRef, trimmedVideoFile,'data_url',metaData)
        await uploadBytes(audioRef, audioFile,audioMetadata)
        // VIDEO URL
        const storageURL =  await getDownloadURL(videoRef);
        console.log("Video Uploaded")
        // Title
        const userFileTitle = titleInput
        // Image URL
        const userFileImage = fileImage
        // TAG NAME 
        const userTag = tag
        //VIDEO SIZE
        const videoSize = metaData.videoSize 
        // DURATION
    
        const userVideoURL = storageURL
    
        // SET NEW FILE 
        const newFile = {
          content:"",
          title: userFileTitle,
          img: userFileImage,
          url: userVideoURL,
          id: folderFiles.id,
          folder_id: folderId,
          tag: userTag,
          duration: metaData.videoDurationString,
          storage_path_video: storagePathVideo,
          storage_path_audio: storagePathAudio,
          transcription:"",
          related_count: 0,
          video_size: videoSize
        };
    
        //UPDATE LOCAL SCREEN
        setDoc(folderFiles, newFile)
        .then(() => {
          console.log("Document successfully written!");
        });
    
        updateDoc(userRef,{
          storage_take: userData.storage_take + videoSize,
        })
    
     
    
      } else if(currentuser && userData.subscription == true) {
        const currentUserId = currentuser.uid;
        const urlID = folderId;
        const docRef = collection(db, "users", currentUserId, "File-Storage",urlID,"Files");
        const userRef = doc(db,"users",currentUserId)
        const folderFiles = doc(docRef)
        // STORAGE
        const audioMetadata = {
          contentType: 'audio/mp3',
        };
        // FILE NAME
        const allName = `${v4() + metaData.videoName}`
        const metaName = `videos/${allName}`
        const audioName = `audio/${allName}`
        // PATH NAME
        const storagePathVideo = `${"users"+ "/" + currentuser.uid + "/" + folderId + "/" + folderFiles.id + "/" + metaName}`;
        const storagePathAudio = `${"users"+ "/" + currentuser.uid + "/" + folderId + "/" + folderFiles.id + "/" + audioName}`;
        // STORAGE REF
        const videoRef = ref(storage, storagePathVideo);
        const audioRef = ref(storage, storagePathAudio);
        // UPLOAD TO STORAGE
        await uploadString(videoRef, trimmedVideoFile,'data_url',metaData)
        await uploadBytes(audioRef, audioFile,audioMetadata)
        // VIDEO URL
        const storageURL =  await getDownloadURL(videoRef);
        console.log("Video Uploaded")
        // Title
        const userFileTitle = titleInput
        // Image URL
        const userFileImage = fileImage
        // TAG NAME 
        const userTag = tag
        //VIDEO SIZE
        const videoSize = metaData.videoSize 
        // DURATION
    
        const formattedDuration = metaData.videoDuration;
        const userVideoURL = storageURL
    
        // SET NEW FILE 
        const newFile = {
          content:"",
          title: userFileTitle,
          img: userFileImage,
          url: userVideoURL,
          id: folderFiles.id,
          folder_id: folderId,
          tag: userTag,
          duration: formattedDuration,
          storage_path_video: storagePathVideo,
          storage_path_audio: storagePathAudio,
          transcription:"",
          related_count: 0,
          video_size: videoSize
        };
    
        //UPDATE LOCAL SCREEN
        setDoc(folderFiles, newFile)
        .then(() => {
         console.log("Document successfully written!");
        });
    
        updateDoc(userRef,{
          storage_take: userData.storage_take + videoSize,
        })
    
    
      }else{
        alert("Clip is too long for free users ! If you want to save longer then 10 minutes clips, please upgrade your account !")
      }
      //HIDE POP UP LOGIC
      if (!isLinkActive) { 
        setIsLinkActive(true)
      } 
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLinkActive(false)
    }

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

    const fetchUserData = async () => {
      if(currentuser){
         const userRef = doc(db, "users", currentuser.uid);
         const userSnap = await getDoc(userRef);
         if (userSnap.exists()) {
            setUserData(userSnap.data())
         } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
      
         }
      }
   }

useEffect(() => {
  fetchData();
  fetchUserData();
  if (!isLinkActive) {
    setPodcastUrl(podcastURL)
  }else{
    setPodcastUrl(null)
  }
}, [])




    return (
 
            <div className= {`popup-fodler ${!isLinkActive ? 'active' : ''}`}id="popup-link" onSubmit={handleSubmit}>
                    <div className="overlay-popup-fodler-link"></div>
                    <div className="content-popup-fodler-link">
                      <div className="close-btn-fodler-link" onClick={pickedPopup} id="popClose-link" style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>Back</div>
                      <div style={{paddingBottom:150,width:"100%"}}>
                        <input className='clip_input' type="text" style={{width:"80%",border:"none",textAlign:"center",height:80,fontSize:30,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",borderRadius:60}} value={titleInput} onChange={handleTitleInput} />
                      </div>
                      <div className="popup-fodler-con-link">
                          {/*<MultipleSelectCheckmarks />*/}
                          <div className="add-link2">
                         
                          
                          <VideoUrlApp subscriptionState={userData.subscription} setCreateBtn={setIsAddedOn} setPassedDataUrl={setTrimmedVideoFile} fileImage={setFileImage} setExtractMeta={setMetaData} setPassedAudioDataUrl={setAudioFile} UrlFromOutSide={podcastUrl}/>
  
                          </div>
                          <div className="add-link-notes2">
                            <h1>*Select Folder</h1>
                            {/**/}
                      <Box sx={{ minWidth: 120,marginBottom:10 }}>
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
                        <MenuItem key={folder.id} value={folder.id} style={{background:`${folder.color}`,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginBottom:3}}>
                        {folder.title}
                        </MenuItem>
                      ))}
      
        </Select>
      </FormControl>
                      </Box>
                      <FolderCreate chandedSignal={() =>  fetchData()} />
                            {/*TAGS */}
                            <h5>Add Tags</h5>
                            <MultipleSelectCheckmarks selectedTag={setTag}/>
                          </div>
                        </div>
                        {
                        isAddedOn? <div className="create-btn-bottom" onClick={createFile}><DelayingAppearance id="create-upload2" variant="contained"/></div> :null
                      }
                    </div>
                  </div>
              
    )
}

export default LinkPopUp