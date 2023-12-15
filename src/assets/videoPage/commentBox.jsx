import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';
import  StaticRating from './staticRateUi';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection,doc,deleteDoc,setDoc,getDoc } from 'firebase/firestore';
import {useAuth} from "../../context/UserAuthContext"
import ReplyCommentBox from './replyCommentBox';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const CommentBox = ({
    userTag,
    userComment,
    commentRate,
    userVisitId,
    commentAvatar,
    videoID,
    commentID,

}) => {

const {currentuser} = useAuth();

const [isLiked, setIsLiked] = useState(false);
const [isDisLiked, setIsDisLiked] = useState(false);

const [likesArray, setLikesArray] = useState([]);
const [disLikesArray, setDisLikesArray] = useState([]);
const [userData, setUserData] = useState([]);

const [userReplyComment, setUserComment] = useState('');
const [replyArray,setReplyArray] = useState([]);
const [isReply, setIsReply] = useState(false);
const [isReplyOpen, setIsReplyOpen] = useState(false);
const [ownComment, setOwnComment] = useState(false);


const fetchLikes = async () => {
  //FIRESTORE FETCH
  const likesRef = collection(db,"videos",videoID,"comments",commentID,"like");
  const disLikesRef = collection(db,"videos",videoID,"comments",commentID,"dislike");
  const likesSnapshot = await getDocs(likesRef);
  const disLikesSnapshot = await getDocs(disLikesRef);

  const likesList = likesSnapshot.docs.map(doc => doc.data());
  const disLikesList = disLikesSnapshot.docs.map(doc => doc.data());
  if (likesList.some(like => like.id === currentuser.uid)) {
    setIsLiked(true);
  }
  if (disLikesList.some(dislike => dislike.id === currentuser.uid)) {
    setIsDisLiked(true);
  }
  setDisLikesArray(disLikesList);
  setLikesArray(likesList);

}

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
fetchReply();
fetchLikes();
fetchUserData();
if (currentuser.uid === userVisitId) {
  setOwnComment(true);
}
}, []);

const fetchReply = async () => {
  const replyRef = collection(db,"videos",videoID,"comments",commentID,"reply");
  const replySnapshot = await getDocs(replyRef);
  const replyList = replySnapshot.docs.map(doc => doc.data());
  setReplyArray(replyList);

}

const handleLikeLogic = async () => {

  if (isLiked === false) {
  const likesRef = doc(db,"videos",videoID,"comments",commentID,"like",currentuser.uid);
  const disLikesRef = doc(db,"videos",videoID,"comments",commentID,"dislike",currentuser.uid);

    //LIKE LOGIC
    setDoc(likesRef,{
      id:currentuser.uid
    });
    if(disLikesArray.some(dislike => dislike.id === currentuser.uid)){
      deleteDoc(disLikesRef)
    }
    setIsLiked(true);
    setIsDisLiked(false);
    fetchLikes();

  }
  if (isLiked === true) {
    const likesRef = doc(db,"videos",videoID,"comments",commentID,"like",currentuser.uid);
    //LIKE LOGIC
    if(likesArray.some(like => like.id === currentuser.uid)){
      deleteDoc(likesRef)
    }
    setIsLiked(false);
    fetchLikes();
  }
}

const handleDisLikeLogic = () => {
  const disLikesRef = doc(db,"videos",videoID,"comments",commentID,"dislike",currentuser.uid);
  const likesRef = doc(db,"videos",videoID,"comments",commentID,"like",currentuser.uid);
  if (isDisLiked === false) {
    //LIKE LOGIC
    setDoc(disLikesRef,{
      id:currentuser.uid
    });
    if(likesArray.some(like => like.id === currentuser.uid)){
      deleteDoc(likesRef)
    }
    setIsDisLiked(true);
    setIsLiked(false);
    fetchLikes();
  }else if (isDisLiked === true) {
    //LIKE LOGIC
    if(disLikesArray.some(dislike => dislike.id === currentuser.uid)){
      deleteDoc(disLikesRef)
    }
    setIsDisLiked(false);
    fetchLikes();
  }


}

const handleUserComment = (e) => {
  setUserComment(e.target.value);

}

const handleRepling = () => {
  setIsReply(!isReply);

}

const handleReplySend = async () => {
  const commentUID = Math.random().toString(36).substr(2, 12);
  const replyRef = doc(db,"videos",videoID,"comments",commentID,"reply",commentUID);
  const commentDate = new Date().toLocaleDateString();
  const commentTime = new Date().toLocaleTimeString();
  await setDoc(replyRef,{
    writer_id: currentuser.uid,
    text: userReplyComment,
    user_name: userData.user_name,
    profilePicture: userData.profilePictureURL,
    id: commentUID,
    time: commentTime,
    date: commentDate,

  });
  setUserComment('');
  setIsReply(false);
  fetchReply();


}

const handleReplingToReply = (replyToId) => {
  setIsReply(!isReply);
  const replyText = `${replyToId} ${userReplyComment}`
  setUserComment(replyText);
}



const [commentModalOpen, setCommentModalOpen] = useState(false);
const [reportModalOpen, setReportModalOpen] = useState(false);
const [selectedReport, setSelectedReport] = useState(null);
const [succesPageOpen, setSuccesPageOpen] = useState(false);

const handleOthersComment = () => {
  setCommentModalOpen(true);
}

const handleReport = () => {
  
  setReportModalOpen(true);
}


const handleRadioChange = (event) => {
  setSelectedReport(event.target.value);
};

const handleDeleteComment = async () => {
  const commentRef = doc(db,"videos",videoID,"comments",commentID);
  await deleteDoc(commentRef);
  setCommentModalOpen(false);
  window.location.reload();

}

const sendReport = async () => {
  const reportRef = doc(db,"reports",videoID,"comments",commentID);
  const reportDate = new Date().toLocaleDateString();
  const reportTime = new Date().toLocaleTimeString();
  await setDoc(reportRef,{
    reporter_id: currentuser.uid,
    reporter_name: userData.user_name,
    reporter_profilePicture: userData.profilePictureURL,
    reporter_report: selectedReport,
    id: commentID,
    time: reportTime,
    date: reportDate,
    reported_content: userComment,

  });
  setReportModalOpen(false);
  setSuccesPageOpen(true);
}

return (
<div style={{display:"flex", flexDirection:"column",justifyContent:"space-between"}}>

<div className='comment-box'>
  <Link to={`/creator/${userVisitId}`}>
<Avatar style={{height:40,width:40,flexShrink: 0}} imgProps={{crossOrigin:"anonymus"}} src={commentAvatar} />
</Link>
<div style={{marginLeft:10}}>
    <div style={{display: 'flex', alignItems: 'center',marginBottom:5}}>
    <h4 style={{fontSize:12,marginRight:10}}>{userTag}</h4>
    < StaticRating rateValue={commentRate} />
    <hr style={{ display: 'inline-block', width: '100%', marginLeft: 10,opacity:0.2 }} />

    {!ownComment?(
      <div>
      <ReportProblemIcon className='reportComment' onClick={handleReport} />

      <Dialog disableEscapeKeyDown open={reportModalOpen} onClose={()=>setReportModalOpen(!reportModalOpen)} style={{alignItems:"center"}}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap',width:400,height:420}}>
            <FormControl sx={{ m: 1, }}>
              <h6 style={{fontSize:13,fontWeight:500}}>What do you want to Report ?</h6>
              <div style={{marginTop:30,height:300}} className='radioReport'>
              
              <div style={{marginBottom:15,display:"flex",alignItems:"center"}} >
              <input
      
                type="radio"
           
                id="report1"
                name="report"
                value="Hate speech or graphic violence"
                checked={selectedReport === "Hate speech or graphic violence"}
                onChange={handleRadioChange}
                
              />
              <label htmlFor="report1" style={{ marginLeft: 10}}>
                Hate speech or graphic violence
              </label>
    
              </div>
    
              <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
              <input
                type="radio"
                id="report2"
                name="report"
                value="Promotes terrorism"
                checked={selectedReport === "Promotes terrorism"}
                onChange={handleRadioChange}
              />
              <label for="report2" style={{marginLeft:10}}>Promotes terrorism</label>
              </div>

              <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
              <input
                type="radio"
                id="report3"
                name="report"
                value="Pornography or sexually explicit material"
                checked={selectedReport === "Pornography or sexually explicit material"}
                onChange={handleRadioChange}
              />
              <label for="report3" style={{marginLeft:10}}>Pornography or sexually explicit material</label>
                </div>

                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report4" name="report" value="Child Abuse" checked={selectedReport === "Child Abuse"}
                onChange={handleRadioChange} />
                <label for="report4" style={{marginLeft:10}}>Child Abuse</label>
                </div>

                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report5" name="report" value="Harassment or bullying" checked={selectedReport === "Harassment or bullying"}
                onChange={handleRadioChange} />
                <label for="report5" style={{marginLeft:10}}>Harassment or bullying</label><br />
                </div>
                
                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report6" name="report" value="Suicide or self injury" checked={selectedReport === "Suicide or self injury"}
                onChange={handleRadioChange} />
                <label for="report6" style={{marginLeft:10}}>Suicide or self injury</label><br />
                </div>

                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report7" name="report" value="Misinformation" checked={selectedReport === "Misinformation"}
                onChange={handleRadioChange} />
                <label for="report7" style={{marginLeft:10}}>Misinformation</label><br />
                </div>

                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report8" name="report" value="Legal issue" checked={selectedReport === "Legal issue"}
                onChange={handleRadioChange} />
                <label for="report8" style={{marginLeft:10}}>Legal issue</label><br />
                </div>   

                <div style={{marginBottom:15,display:"flex",alignItems:"center"}}>
                <input type="radio" id="report9" name="report" value="Unwanted commercial content or spam" checked={selectedReport === "Unwanted commercial content or spam"}
                onChange={handleRadioChange} />
                <label for="report9" style={{marginLeft:10}}>Unwanted commercial content or spam</label><br />
                </div>



              </div>
      
       
            </FormControl>
     
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setReportModalOpen(!reportModalOpen)}>Back</Button>
          <Button onClick={sendReport}>Send</Button>
        </DialogActions>
      </Dialog>

      <Dialog disableEscapeKeyDown open={succesPageOpen} onClose={()=>setSuccesPageOpen(!succesPageOpen)} style={{alignItems:"center"}}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap',width:400,height:120}}>
            <FormControl sx={{ m: 1, }}>
              <h4 style={{fontSize:13,fontWeight:600}}>Thank you for your help - Your Report is sent succesfully !</h4><br />
              <h6 style={{fontSize:13,fontWeight:500}}>We will review this comment and remove it if found unappropriate !</h6>
      
            </FormControl>
     
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setSuccesPageOpen(!succesPageOpen)}>Ok</Button>
         
        </DialogActions>
      </Dialog>
      </div>
    ):(
      <div>
    <MoreHorizIcon onClick={handleOthersComment} style={{marginLeft:20,opacity:0.8,cursor:"pointer"}} />

      <Dialog disableEscapeKeyDown open={commentModalOpen} onClose={()=>setCommentModalOpen(!commentModalOpen)} style={{alignItems:"center"}}>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap',width:150,height:13}}>
            <FormControl sx={{ m: 1, }}>
        
              <div onClick={handleDeleteComment} className='commentReport' style={{display:"flex",flexDirection:"row",alignItems:"center",marginLeft:4}}>
              <DeleteIcon />
              <h6 style={{fontSize:13,fontWeight:500,marginLeft:15}}>Delete</h6>
              </div>
       
            </FormControl>
     
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setCommentModalOpen(!commentModalOpen)}>Back</Button>
        </DialogActions>
      </Dialog>

   
      </div>
    )}

    </div>


<h6 style={{maxWidth: 1000,minWidth:750,fontSize:13,fontWeight:500}}>{userComment}</h6>

<div style={{display:"flex",flexDirection:"row",marginTop:10}}>

{/*LIKE BUTTON*/}
<div
  onClick={() =>{

    handleLikeLogic()
    }}
    style={{display:"flex",flexDirection:"row"}}
>
{isLiked ? (
    <FavoriteIcon style={{color:"rgb(241, 88, 88)"}} className='comment-feedback-icons'/>
  ) : (
    <FavoriteBorderIcon className='comment-feedback-icons' />
  )}
    <h6>{likesArray.length}</h6>
  </div>

{/*DISLIKE BUTTON*/}
  <div
  onClick={() =>{

    handleDisLikeLogic()
    }}
  style={{marginLeft:10,display:"flex",flexDirection:"row"}}
>
{isDisLiked ? (
    <HeartBrokenIcon style={{ color: "rgb(172, 0, 0)"}} className='comment-feedback-icons-dislike' />
  ) : (
    <HeartBrokenIcon className='comment-feedback-icons-dislike' />
  )}
  <h6>{disLikesArray.length}</h6>
  </div>

{/*REPLY BUTTON*/}
    <div style={{marginLeft:10,cursor:"pointer"}} onClick={handleRepling}>
      {isReply ? 
      <h6 style={{fontSize:13,fontWeight:500}}>Cancel</h6> :
       <h6 style={{fontSize:13,fontWeight:500}}>Reply</h6>
      }
 
    </div>

</div>
</div>   

</div>


{isReply ?
  <div className='comment-box' style={{marginTop:-10}}>
  <Avatar style={{height:30,width:30,flexShrink: 0,marginLeft:30}} imgProps={{crossOrigin:"anonymus"}}  />
    <div style={{marginLeft:10}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
    <input type="text" onChange={handleUserComment} value={userReplyComment} className='comment_input' placeholder='Write a reply' />
    </div>

{userReplyComment.length > 0 ?
    <div style={{display:"flex",flexDirection:"row",justifyContent:"right",marginTop:10}}>
    <h6 className='comment-btns' style={{ fontSize: 13, fontWeight: 500, marginRight: 10, background: "#ffaaaa" }} onClick={()=> {setUserComment("") ;setIsReply(!isReply)}}>Close</h6>
    <div style={{marginRight:10,textAlign:"right"}} onClick={handleReplySend} >
    <h6 className='comment-btns'>Send</h6>
    </div>

</div>:null
}




</div>   
  </div> :null
}

{!isReplyOpen ?(
  <div style={{display:"flex",flexDirection:"row",cursor:"pointer"}} onClick={() => setIsReplyOpen(!isReplyOpen)}>
    <h6 style={{fontWeight:400}}>See Replies</h6>
  </div>
):(
  <div style={{display:"flex",flexDirection:"column"}}>
  <h6 style={{cursor:"pointer",fontWeight:400}} onClick={() => setIsReplyOpen(!isReplyOpen)}>Close</h6>
  {replyArray.map((reply) => (
 <div key={reply.id}>
    <ReplyCommentBox replyId={reply.id} writerId={reply.writer_id} isRepling={isReply} replyAvatar={reply.profilePicture} replyUserName={reply.user_name} replyText={reply.text} videoIDpass={videoID} commentIDpass={commentID} handleReplingToReplypass={(e)=>handleReplingToReply(e)}/>
 </div>


  ))}

</div>


)
}

</div>
);
}

export default CommentBox;