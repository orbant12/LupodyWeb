import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAuth } from '../../context/UserAuthContext';
import { db } from '../../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function FolderCreate({chandedSignal}) {
  const [open, setOpen] = React.useState(false);
    const [folderTitle, setfolderTitle] = React.useState("");
    const [folderColor, setfolderColor] = React.useState("");
  

const { currentuser } = useAuth();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
        setfolderTitle(e.target.value);

  }

  const handleInputChange2 = (e) => {
    setfolderColor(e.target.value);
  }

    const handleSubmit = (e) => {
    e.preventDefault();
    setfolderTitle("")
    setfolderColor("")
    chandedSignal()
    }

const addFolder = async () => {
    if (currentuser && folderTitle !== "" && folderColor !== ""){
      // USER ID & FIRESTORE REF
      const currentUserId = currentuser.uid;
      const docRef = collection(db, "users", currentUserId, "File-Storage");
      const newFolderRef = doc(docRef);
      // CREATED FOLDER DETAILS
      const newFolder = {
        title: folderTitle,
        color: folderColor,
        id: newFolderRef.id,
        files_count:0,
      };
      //SET FOLDER DETAILS TO FIRESTORE
      setDoc(newFolderRef, newFolder)
      .then(() => {
        setFolders((currentFolders) => [
          ...currentFolders,
          { id: newFolderRef.id, ...newFolder },
        ]);
      })
    }else if (folderTitle === "" || folderColor === ""){
      alert("Please fill all the fields")
    }
    await chandedSignal()
    handleClose()
    handleSubmit()
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} style={{marginTop:-20,marginBottom:50}}>
        Create New Folder
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
   
      >
        <DialogTitle id="alert-dialog-title">
          {"Create a Folder"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <div className="content-popup" style={{width:300}}>
                    
                
                     <div className="wave-group">
                        <h3>Title</h3>
                        <input style={{padding:5,border:"none",borderBottom:"1px solid black"}}  value={folderTitle} type="text" className="input" id="user-container-title" onChange={handleInputChange}/>
                  
             
                        <div className='colorDiv' style={{marginTop:10}}>    
                  <h3>Pick a Color</h3>
                  <div className='bottom-add-folder'>
                      <span className="color-picker">
                        <label>
                         <input type="color" style={{width:80,height:30}}  value={folderColor} onChange={handleInputChange2} id="colorPicker"/>
                
                        </label>
                      </span>
                     
                      </div>
              </div> 
              
                
                
                     
                      </div>
                    </div>
          </DialogContentText>
        </DialogContent>

 
        <DialogActions>
        <Button onClick={handleClose} autoFocus>
            Back
          </Button>
          <Button onClick={addFolder} autoFocus>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}