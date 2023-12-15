import react, {useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useAuth } from "../../context/UserAuthContext.jsx";
import { db, storage } from "../../firebase";
import { doc, updateDoc,getDoc,getDocs,collection,deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL,deleteObject,listAll } from "firebase/storage";
import DeleteIcon from '@mui/icons-material/Delete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CategorySelect from "../UserProfile/categorySelect.jsx"
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { updatePassword,sendEmailVerification } from "firebase/auth";
import "../../Css/settings.css"
import "../../Css/sidebar.css"




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

export default function BasicTabs({passUserData}) {


  const { currentuser } = useAuth();

  
//PROFILE

const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")
const [passMatch,setPassMatch] = useState(false)
const [notEmpty,setNotEmpty] = useState(false)
const [notLong,setNotLong] = useState(false)
const [isEmailVerified,setIsEmailVerified] = useState(false)
const [image,setImage] = useState(null)
const [newUsername,setNewUsername] = useState("")

const [value, setValue] = useState(0);

const [userData, setUserData] = useState([]);
const [folderId, setFolderId] = useState('');
const [folders, setFolders] = useState([]);
const [videoData, setVideoData] = useState([]);

const [newThubnail, setNewThubnail] = useState(null);

//EDITING
const [isThubnailEdit, setIsThubnailEdit] = useState(false);
const [newThunailUrl, setNewThubnailUrl] = useState(null);

//INTRO
const [isIntroEdit, setIsIntroEdit] = useState(false);
const [newIntro, setNewIntro] = useState(null);
const [newIntroUrl, setNewIntroUrl] = useState(null);

//TITLE
const [isTitleEdit, setIsTitleEdit] = useState(false);
const [newTitle, setNewTitle] = useState(null);

//DESC
const [newDesc, setNewDesc] = useState(null);

//CATEGORY
const [isCategoryEdit, setIsCategoryEdit] = useState(false);
const [newCategory, setNewCategory] = useState(null);

//SELECT CLIPPIFY FOLDER
  const handleChange = (event) => {
    setFolderId(event.target.value);
  };
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
          setNewUsername(elementData.fullname)
        } else {
          console.log("Document does not exist.");
          setUserData(null); // Set to null or handle accordingly
        }
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };

  //NAVIGATIONS
const handleVideo = () => {
    window.location.href = "/creator-page/videos";
};

const handleCommunity = () => {
    window.location.href = "/creator-page/community";

};

//NAVIGATIONS
const handleAnalitycs = async() => {

  window.location.href = "/creator-page/analitycs";

};


const handlePersonalSettings = () => {
    window.location.href = "/creator-page/personal-settings";
}
const handleLater = () => {
    window.location.href = "/creator/";
}

//FODLERDATA CLIPPIFY
const fetchData = async () => {
    if (!currentuser) {
      setFolders([]);
      return console.log("fetching data NONE")
    }
    console.log("fetching data")
    // USER ID & FIRESTORE REF
    const currentUserId = currentuser.uid;
    const colRef = collection(db, "users", currentUserId, "Videos");
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


const fetchVideoData = async () => {
    if(currentuser && folderId !== ""){
    //SELECTED VIDEO REF
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const docSnap = await getDoc(videoRef);
    if (docSnap.exists()) {
      const elementData = docSnap.data();
      setVideoData(elementData);
      setNewDesc(elementData.description);
      console.log("Document data:", elementData);
    } else {
      console.log("No such document!");
    }
}
    
}


useEffect(() => {
    if(location.pathname === "/creator-page"){
        setValue(0);
        fetchData()
      }else if(location.pathname === "/creator-page/videos"){
        setValue(0);
        fetchData()
      }else if (location.pathname === "/creator-page/cummunity"){
        setValue(1);
    
      }else if(location.pathname === "/creator-page/analitycs"){
        setValue(2);
      }else if(location.pathname === "/creator-page/personal-settings"){
        setValue(3);
      }
      fetchUserData()
    
}, [currentuser]);

useEffect(() => {
    fetchVideoData();
}, [folderId]);


const deleteFilesInStorage = async () => {
    const storageRef = ref(storage, `podcasts/${folderId}`);
    const storage2Ref = ref(storage, `podcasts/${folderId}/intro`);
    const storage3Ref = ref(storage, `podcasts/${folderId}/thubnail`);
    // List all items in the storage directory
    const items = await listAll(storageRef);
    const items2 = await listAll(storage2Ref);
    const items3 = await listAll(storage3Ref);

    // Delete each file in the storage directory
    await Promise.all(items.items.map(async (item) => {
        await deleteObject(item);
    }));
    await Promise.all(items2.items.map(async (item) => {
        await deleteObject(item);
    }));
    await Promise.all(items3.items.map(async (item) => {
        await deleteObject(item);
    }));
};

const [deleteModalOpen, setDeleteModalOpen] = useState(false);

const deleteVideo = async () => {
    if(currentuser && folderId !== ""){
        const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
        const publickVideoRef = doc(db, "videos", folderId);
 
     
        await deleteDoc(videoRef);
        await deleteDoc(publickVideoRef);
        await deleteFilesInStorage();
        
        fetchData();
        setDeleteModalOpen(false);
        window.location.reload();
        
    }
}

const handleBack = () => {
    setDeleteModalOpen(false);

}


const handleDeleteAsk = () => {
    if(folderId !== ""){
        setDeleteModalOpen(true);
    }else{
        alert("Please Select Video")
    }
  

}

const saveThubnailEditing = async () => {
  const randomUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //UPDATE DOCS
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const publickVideoRef = doc(db, "videos", folderId);
    const storageRef = ref(storage, `podcasts/${folderId}/thubnail/${randomUID}`);
    await uploadBytes(storageRef, newThubnail);
    const URL = await getDownloadURL(storageRef);
    //UPDATE DOCS
    console.log(URL)
    updateDoc(videoRef, {
        thubnail: URL,
    });
    updateDoc(publickVideoRef, {
        thubnail: URL,
    });
    //UPDATE STORAGE
   
    setIsThubnailEdit(false);
    fetchVideoData();

}

const undoThubnailEditing = () => {
    setIsThubnailEdit(false);
    setNewThubnail(null);
    setNewThubnailUrl(null);
}

const handleNewThubnail = (e) => {
    const file = e.target.files[0];
    setNewThubnail(file);
    setNewThubnailUrl(URL.createObjectURL(file));
}

const handleNewTitle = (e) => {
    const newTitle = e.target.value;
    setNewTitle(newTitle);
}

const saveTitlediting = async () => {
    //UPDATE DOCS
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const publickVideoRef = doc(db, "videos", folderId);
    //UPDATE DOCS
    updateDoc(videoRef, {
        title: newTitle,
    });
    updateDoc(publickVideoRef, {
        title: newTitle,
    });
    //UPDATE STORAGE
    
    setIsTitleEdit(false);
    fetchVideoData();

}

const saveIntroEditing = async () => {
  const randomUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //UPDATE DOCS
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const publickVideoRef = doc(db, "videos", folderId);
    const storageRef = ref(storage, `podcasts/${folderId}/intro/${randomUID}`);
    await uploadBytes(storageRef, newIntro);
    const URL = await getDownloadURL(storageRef);
    //UPDATE DOCS
    console.log(URL)
    alert("Intro Updated Successfully !")
    updateDoc(videoRef, {
        intro: URL,
    });
    updateDoc(publickVideoRef, {
        intro: URL,
    });
    //UPDATE STORAGE
   
    setIsIntroEdit(false);
    fetchVideoData();
}

const undoIntroEditing = () => {
    setIsIntroEdit(false);
    setNewIntro(null);
    setNewIntroUrl(null);
}

const handleNewIntro = (e) => {
    const file = e.target.files[0];
    setNewIntro(file);
    setNewIntroUrl(URL.createObjectURL(file));
}

const undoTitleEditing = () => {
    setIsTitleEdit(false);
    setNewTitle("");
}

const handleDescChange = (e) => {
    const newDesc = e.target.value;
    setNewDesc(newDesc);
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const publickVideoRef = doc(db, "videos", folderId);
    updateDoc(videoRef, {
        description: newDesc,
    });
    updateDoc(publickVideoRef, {
        description: newDesc,
    });

}




const saveCategoryEditing = () => {
    const videoRef = doc(db, "users", currentuser.uid, "Videos", folderId);
    const publickVideoRef = doc(db, "videos", folderId);
    updateDoc(videoRef, {
        video_category: newCategory,
    });
    updateDoc(publickVideoRef, {
        video_category: newCategory,
    });
   
    setIsCategoryEdit(false);
    fetchVideoData();
}

const undoCategoryEditing = () => {
    setIsCategoryEdit(false);
}

//PROFILE

const handleUsername = (event) => {
  setNewUsername(event.target.value);
};

//HANDLE SAVE USERNAME
const handleSaveButtonUserName = () => {
  if(currentuser && newUsername.length >= 4){
      const inputNewUsername = newUsername
      const userRef = doc(db,"users",currentuser.uid)
      const newData = {
       
          fullname: inputNewUsername,

      }
      try{
          updateDoc(userRef,newData)
          console.log("success username change")
          alert("Your Username has been changed Successfully !")
          fetchUserData()
      }catch(err){
          console.log(err)
      }
  }else if(4 >= newUsername.length){
      alert("Username Needs to be longer then 3 words !")
  }
}

const handlePassword = (event) => {
  setPassword(event.target.value);
};

const handleConfirmPassword = (event) => {
  setConfirmPassword(event.target.value);
};



const handleURL = (event) => {
  const file = event.target.files[0];
  setImage(file);
};

//PASSWORD CONFIMATION
useEffect(()=> {
  if(password == confirmPassword && password != "" && password.length > 7){
      setPassMatch(true)
      setNotLong(false)
      setNotEmpty(false)
  }else if (password == confirmPassword && password != "" && 7 >= password.length){
      setNotLong(true)
      setNotEmpty(false)
  }else if (password.length != 0 && confirmPassword.length != 0 && password != confirmPassword){
      setNotEmpty(true)
      setPassMatch(false)
      setNotLong(false)
  }

  if(password.length == 0 && confirmPassword.length == 0){
      setPassMatch(false)
      setPassMatch(false)
      setNotEmpty(false)
      setNotLong(false)
  }
},[confirmPassword,password]);

//EMAIL VERIFY
const handleVerify = () =>{
  if(currentuser.emailVerified == false){
      sendEmailVerification(currentuser)
      .then(() => {
          alert("Email Verification Sent")
      });
  }else{
      alert("Your Email is already Verified !")
  }
};

const handleUpload = async() =>{
  if(currentuser && image != null){
      const userRef = doc(db,"users",currentuser.uid)
      const storageRef = ref(storage,`users/${currentuser.uid}/profilePicture/${image.name}`)
      await uploadBytes(storageRef,image)
      const uploadedURL = await getDownloadURL(storageRef)
      const newData = {
      
          profilePictureURL: uploadedURL,

      }
  try{
      updateDoc(userRef,newData)
      console.log("success upload")
      alert("Your Profile Picture Uploaded Successfully")
      fetchUserData()
  }catch(err){
      console.log(err)
  }
  
}
 
}

const handleSaveButton = () =>{
  if(passMatch && currentuser){
      updatePassword(currentuser,password) 
  }else{
      alert("Password not matching")
  }
};


//EMAIL VERIFICATION
useEffect(()=> {
  if(currentuser){
      if(currentuser.emailVerified == true){
          setIsEmailVerified(true)
      }else if (currentuser.emailVerified == false){
          setIsEmailVerified(false)
      }
      fetchUserData()
  }
},[currentuser])



  return (
    <Box sx={{paddingLeft:12, width: '100%',background:"white" }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} aria-label="basic tabs example">
          <Tab onClick={handleVideo} label="Videos" {...a11yProps(0)} />
          <Tab onClick={handleCommunity} label="Community" {...a11yProps(1)} />
          <Tab onClick={handleAnalitycs} label="Analitycs" {...a11yProps(2)} />
          <Tab onClick={handlePersonalSettings} label="Personal Settings" {...a11yProps(3)} />
          <Tab onClick={handleLater} label="Watch Later" {...a11yProps(4)} />
        </Tabs>
      </Box>
        <CustomTabPanel value={value} index={0}>
        <div style={{display:"flex",flexDirection:"row",width:"90%",justifyContent:"space-between"}}>
        <Box sx={{ minWidth: 120 }}>
      <FormControl style={{width:300}}>
        <InputLabel id="demo-simple-select-label">Videos</InputLabel>
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

    <div className='deleteVideo' onClick={handleDeleteAsk} style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly",cursor:"pointer",alignItems:"center",opacity:0.6,padding:"0px 8px"}}>
        <DeleteIcon />
        <h3 style={{fontWeight:500}}>Delete Video</h3>
        <Dialog disableEscapeKeyDown open={deleteModalOpen} style={{alignItems:"center"}}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap',width:400,height:80}}>
            <FormControl sx={{ m: 1, }}>
              <h3 style={{fontSize:17,fontWeight:500}}>Are you sure you want to delete this video from everywhere ?</h3>
            </FormControl>
     
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack}>Back</Button>
          <Button style={{color:"red"}} onClick={deleteVideo}>Delete</Button>
        </DialogActions>
      </Dialog>

    </div>


       
        </div> 
        {videoData.length === 0 ? (
        <div className="no-doc" style={{marginTop:100,paddingBottom:500}}>No Selected Video</div>
        ):(
            <div style={{display:"flex",flexDirection:"column"}}>

        <div style={{display:"flex",flexDirection:"row",width:"90%",justifyContent:"space-between",marginTop:80,alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Video</h3>
                <hr style={{width:60,borderStyle:"double"}}/>
                <div style={{width:345,height:200,maxHeight:250,borderRadius:20,marginTop:40}}>
              <video
                src={videoData.video}
                autoPlay
                controls
                muted
                width="345"
                height="200"
                crossOrigin='anonymus'
         
                            
              ></video>
            </div>
            <div className='deleteVideo' onClick={handleDeleteAsk} style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginTop:30,border:"1px dashed rgb(241, 88, 88)",color:"rgb(241, 88, 88)", padding:"5px 10px"}}>
                <h6>Delete</h6>
            </div>
            </div>

            <hr style={{height:150,borderStyle:"groove"}} />
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Thumbnail</h3>
                <hr style={{width:100,borderStyle:"double"}}/>
                {isThubnailEdit ? (
                  <div>
                <div style={{width:345,height:200,maxHeight:250,borderRadius:20,marginTop:40}}>
                  {newThunailUrl !== null ? (
                  <img src={newThunailUrl} crossOrigin='anonymus' style={{width:300,height:170,marginTop:40,borderRadius:10,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="Thubnail" />
                  ):null}
               
                  <input style={{marginTop:80}} type="file" onChange={handleNewThubnail} />
                  </div>
                  <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>

                               <div onClick={saveThubnailEditing} className='editBTN' style={{marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:1, color:"#1DA1F2"}}>
                               <h6>Save New</h6>
                           </div>
                           <div onClick={undoThubnailEditing} className='editBTN' style={{marginTop:30,border:"1px dashed rgb(241, 88, 88)",padding:"5px 10px",opacity:1, color:"rgb(241, 88, 88)"}}>
                               <h6>Undo</h6>
                           </div>
                           </div>
                    </div>
                ):(
                  <div>
            <img src={videoData.thubnail} crossOrigin='anonymus' style={{width:300,height:170,marginTop:40,borderRadius:10,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} alt="Thubnail" />
            <div onClick={()=>{setIsThubnailEdit(!isThubnailEdit)}} className='editBTN' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginLeft:"auto",marginRight:"auto",marginTop:30,width:44,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2"}}>
            <h6>Edit</h6>
        </div>
        </div>
                )}
                
   
            </div>
            <hr style={{height:150,borderStyle:"groove"}} />
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Intro</h3>
                <hr style={{width:50,borderStyle:"double"}}/>
                {isIntroEdit ? (
                  <div>
                <div style={{width:345,height:200,maxHeight:250,borderRadius:20,marginTop:40}}>
                  {newIntroUrl !== null ? (
                 <div style={{width:345,height:200,maxHeight:250,borderRadius:20,marginTop:40}}>
                 <video
                   src={newIntroUrl}
                   autoPlay
                   controls
                   muted
                   width="345"
                   height="200"
                   crossOrigin='anonymus'
            
                               
                 ></video>
               </div>
                  ):null}
               
                  <input style={{marginTop:80}} type="file" onChange={handleNewIntro} />
                  </div>
                  <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>

                               <div onClick={saveIntroEditing} className='editBTN' style={{marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:1, color:"#1DA1F2"}}>
                               <h6>Save New</h6>
                           </div>
                           <div onClick={undoIntroEditing} className='editBTN' style={{marginTop:30,border:"1px dashed rgb(241, 88, 88)",padding:"5px 10px",opacity:1, color:"rgb(241, 88, 88)"}}>
                               <h6>Undo</h6>
                           </div>
                           </div>
                    </div>
                ):(
                  <div>
                    <div style={{width:345,height:200,maxHeight:250,borderRadius:20,marginTop:40}}>
              <video
                src={videoData.intro}
                autoPlay
                controls
                muted
                width="345"
                height="200"
                crossOrigin='anonymus'
         
                            
              ></video>
            </div>
            
            <div onClick={()=>{setIsIntroEdit(!isIntroEdit)}} className='editBTN' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginLeft:"auto",marginRight:"auto",marginTop:30,width:44,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2"}}>
            <h6>Edit</h6>
        </div>
        </div>
                )}
                
            </div>
        </div>

        <hr style={{marginTop:30,width:"90%",borderStyle:"groove",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}/>

        <div style={{display:"flex",flexDirection:"row",width:"90%",justifyContent:"space-evenly",marginTop:80,alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"30%"}}>
                <h3>Title</h3>
                <hr style={{width:50,borderStyle:"double"}}/>
                {isTitleEdit ? (
                  <div>
                  <div style={{marginTop:40}}>
                    <input type="text" style={{padding:8,width:"100%"}} value={newTitle} onChange={handleNewTitle} />
                  </div>
                  <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>

          <div onClick={saveTitlediting} className='editBTN' style={{marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:1, color:"#1DA1F2"}}>
            <h6>Save New</h6>
        </div>
        <div onClick={undoTitleEditing} className='editBTN' style={{marginTop:30,border:"1px dashed rgb(241, 88, 88)",padding:"5px 10px",opacity:1, color:"rgb(241, 88, 88)"}}>
          <h6>Undo</h6>
        </div>
      </div>
    </div>
                
                ):(
                  <div>
                    <h5 style={{marginTop:20}}>{videoData.title}</h5>
                <div onClick={() => 
                {  setIsTitleEdit(!isTitleEdit);
                  setNewTitle(videoData.title)}
                } 
                  className='editBTN' style={{marginLeft:"auto",marginRight:"auto",width:44,marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
                <h6>Edit</h6>
            </div>
                  </div>
                )

                } 
            </div>
            <hr style={{height:150,borderStyle:"groove"}} />
            <div style={{display:"flex",flexDirection:"column",alignItems:"start",width:"100%",marginLeft:50}}>
              <h6 style={{opacity:0.6,fontWeight:400}}>Updates Automatically</h6>
                <h3>Description</h3>
                <hr style={{width:120,borderStyle:"double"}}/>
                
                <textarea onChange={handleDescChange} value={newDesc} style={{whiteSpace:"pre-line",width:"100%",marginTop:40,border:"none",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",padding:10}} name="" id="" cols="30" rows="10"></textarea>
         
            </div>
        
        </div>
        <hr style={{marginTop:80,borderStyle:"groove",width:"90%",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}/>
        
        <div style={{display:"flex",flexDirection:"row",width:"90%",justifyContent:"space-evenly",marginTop:80,alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Category</h3>
                <hr style={{width:80,borderStyle:"double"}}/>
                {isCategoryEdit ? (
                  <div style={{marginTop:40}}>
                  <CategorySelect passCategory={setNewCategory}/>
                  <div style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}>

                    <div onClick={saveCategoryEditing} className='editBTN' style={{marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:1, color:"#1DA1F2"}}>
                    <h6>Save New</h6>
                    </div>
                    <div onClick={undoCategoryEditing} className='editBTN' style={{marginTop:30,border:"1px dashed rgb(241, 88, 88)",padding:"5px 10px",opacity:1, color:"rgb(241, 88, 88)"}}>
                    <h6>Undo</h6>
                    </div>
                    </div>

                  </div>
                ):(
                  <div>
                  <h5 style={{marginTop:20,fontWeight:500}}>{videoData.video_category}</h5>
                  <div className='editBTN' onClick={()=> setIsCategoryEdit(!isCategoryEdit)} style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2"}}>
                  <h6>Edit</h6>
              </div>
              </div>
                )

                }
               
              
     
            </div>
            <hr style={{height:150,borderStyle:"groove"}} />
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Cast</h3>
                <hr style={{width:80,borderStyle:"double"}}/>
                <h5 style={{marginTop:20}}>{videoData.video_category}</h5>
                <div className='editBTN' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2"}}>
                <h6>Edit</h6>
            </div>
            </div>
            <hr style={{height:150,borderStyle:"groove"}} />

            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <h3>Settings</h3>
                <hr style={{width:80,borderStyle:"double"}}/>
                <h5 style={{marginTop:20}}>{videoData.video_category}</h5>
                <div className='editBTN' style={{boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginTop:30,border:"1px dashed #1DA1F2",padding:"5px 10px",opacity:0.5, color:"#1DA1F2"}}>
                <h6>Edit</h6>
            </div>
            </div>
       
        
        </div>

        </div>
  
        )

        }
      
    </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
             {/*PROFILE*/}
             <div className='settings'>
             <div className='profile-settings' id='profile-settings'>
            <div className='profile-title' style={{marginTop:-20}}>
                <div className='title-row'>
                    <div >
                        <h2 className='profile-title-txt'>Profile</h2>
                        <h5 className='profile-title-desc'>Change your profile details</h5>
                    </div>

                 
           
                </div>
             
                <hr style={{marginTop:10}} />
            </div>



            <div className='profile-first-row'>
                <div>
                    <h5 className='text-settings'>User Name</h5>
                    <h6 style={{opacity:0.6}}>Type inside of the block</h6>
                </div>

               <input type="text" style={{width:300}} value={newUsername} onChange={handleUsername} />
               <div>
                        <button className='submit-settings-btn' onClick={handleSaveButtonUserName} >Save</button>
                    </div>
            </div>
            <hr style={{marginTop:50}} />

            <div className='profile-first-row-pass'>
                <div>
                    <h5>Password</h5>
                    <h6 style={{opacity:0.6}}>Security</h6>
                </div>
            <div className='pass-inputs'>
               <input type="password" style={{width:300}} placeholder="New Password" value={password} onChange={handlePassword}/>
               <input type="password" style={{width:300}} placeholder="Confirm New Password" value={confirmPassword} onChange={handleConfirmPassword}/>
               {passMatch === true?
               <div style={{display:"flex",flexDirection:"row",color:"green"}}>
               <CheckIcon />
                <h3>Correct</h3>
                </div>:null
               }
                  {notLong === true?
                <div style={{display:"flex",flexDirection:"row",color:"red"}}>
                  <ClearIcon />
                <h6>Not Long Enough - Add more then 7 letters</h6>
                </div>:null
               }
               {
                notEmpty ? 
            <div style={{display:"flex",flexDirection:"row",color:"red"}}>
                <ClearIcon />
            <h6>Passwords not matching</h6>
              </div>:null
            }
    
            </div>
    
            <button className='submit-settings-btn' onClick={handleSaveButton} >Save</button>
              
              
            </div>
            <hr style={{marginTop:50}} />

            <div className='profile-first-row-picture'>
                <div>
                    <h5>Profile Picture</h5>
                    <h6 style={{opacity:0.6}}>Upload you profile picture</h6>
                </div>
              {userData.profilePictureURL !== "" ? (
                   <img crossOrigin='anonymus' style={{maxHeight: 150,width:150,marginTop:0,borderRadius:10}} src={userData.profilePictureURL} alt="Profile Picture" />
              ):null
              }
             
 
                <input type="file" onChange={handleURL} />
         
              

               <button className='submit-settings-btn' onClick={handleUpload}>Upload</button>
             
              
            </div>
            <hr style={{marginTop:100}} />

            <div className='profile-first-row-details'>
                <div>
                    <h5>Current Details</h5>
                    <h6 style={{opacity:0.6}}>These are live data</h6>
                </div>

               <div>
                <h6 className='highlighter'>{(userData.storage_take / 1000000 / 1000).toFixed(2)} GB</h6>
                <h5 style={{fontWeight:600}}>Storage Take</h5>
               </div>

               <a href="/subscription"><div>
                <h6>{!userData.subscription?<span className='highlighter'>Free</span>:<span className='highlighter'>Premium</span>}</h6>
                <h5 style={{fontWeight:600}}>Subscription</h5>
               </div></a>

               <div>
                <h6 className='highlighter'>{userData.user_since}</h6>
                <h5 style={{fontWeight:600}}>User Since</h5>
               </div>

               <div onClick={handleVerify} style={{cursor:"pointer"}}>
                <h6 className='highlighter'>{userData.email}</h6>
                {!isEmailVerified?
                <h5>Not Verified - Click to Verify</h5>:
                <h5 style={{fontWeight:600}}>Verified</h5>
                }
               </div>

               
              
            </div>
            <hr style={{marginTop:50}} />
      
        </div>
        </div>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
        </CustomTabPanel>


    </Box>
  );
}