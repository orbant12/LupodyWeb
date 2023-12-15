import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { getDocs, collection,doc,deleteDoc,setDoc,getDoc } from 'firebase/firestore';
import {useAuth} from "../../context/UserAuthContext"


const ReplyCommentBox = ({
    replyId,
    writerId,
    replyUserName,
    replyText,
    replyAvatar,
    isRepling,
    videoIDpass,
    commentIDpass,
    handleReplingToReplypass
}) => {

const {currentuser} = useAuth();

const [replyLikesArray, setReplyLikesArray] = useState([]);
const [replyDisLikesArray, setReplyDisLikesArray] = useState([]);
const [isReplyLiked, setIsReplyLiked] = useState(false);
const [isReplyDisLiked, setIsReplyDisLiked] = useState(false);

const fetchReplyLikes = async () => {
    const likesRef = collection(db, "videos", videoIDpass, "comments", commentIDpass, "reply", replyId, "like");
    const disLikesRef = collection(db, "videos", videoIDpass, "comments", commentIDpass, "reply", replyId, "dislike");

    const likesSnapshot = await getDocs(likesRef);
  const disLikesSnapshot = await getDocs(disLikesRef);

  const likesList = likesSnapshot.docs.map(doc => doc.data());
  const disLikesList = disLikesSnapshot.docs.map(doc => doc.data());
  if (likesList.some(like => like.id === currentuser.uid)) {
    setIsReplyLiked(true);
  }
  if (disLikesList.some(dislike => dislike.id === currentuser.uid)) {
    setIsReplyDisLiked(true);
  }
  setReplyDisLikesArray(disLikesList);
  setReplyLikesArray(likesList);
   
}

const handleReplyLikeLogic = async () => {
  
    if (isReplyLiked === false) {
    const likesRef = doc(db,"videos",videoIDpass,"comments",commentIDpass,"reply",replyId,"like",currentuser.uid);
    const disLikesRef = doc(db,"videos",videoIDpass,"comments",commentIDpass,"reply",replyId,"dislike",currentuser.uid);
  
      //LIKE LOGIC
      setDoc(likesRef,{
        id:currentuser.uid
      });
      if(replyDisLikesArray.some(dislike => dislike.id === currentuser.uid)){
        deleteDoc(disLikesRef)
      }
      setIsReplyLiked(true);
      setIsReplyDisLiked(false);
      fetchReplyLikes();
  
    }
    if (isReplyLiked === true) {
      const likesRef = doc(db,"videos",videoIDpass,"comments",commentIDpass,"reply",replyId,"like",currentuser.uid);
      //LIKE LOGIC
      if(replyLikesArray.some(like => like.id === currentuser.uid)){
        deleteDoc(likesRef)
      }
      setIsReplyLiked(false);
      fetchReplyLikes();
    }
}

const handleReplyDisLikeLogic = async () => {
    const likesRef = doc(db,"videos",videoIDpass,"comments",commentIDpass,"reply",replyId,"like",currentuser.uid);
    const disLikesRef = doc(db,"videos",videoIDpass,"comments",commentIDpass,"reply",replyId,"dislike",currentuser.uid);
    if (isReplyDisLiked === false) {
      //LIKE LOGIC
      setDoc(disLikesRef,{
        id:currentuser.uid
      });
      if(replyLikesArray.some(like => like.id === currentuser.uid)){
        deleteDoc(likesRef)
      }
      setIsReplyDisLiked(true);
      setIsReplyLiked(false);
      fetchReplyLikes();
    }else if (isReplyDisLiked === true) {
      //LIKE LOGIC
      if(replyDisLikesArray.some(dislike => dislike.id === currentuser.uid)){
        deleteDoc(disLikesRef)
      }
      setIsReplyDisLiked(false);
      fetchReplyLikes();
    
  }
  }

  useEffect(() => {
    fetchReplyLikes()
  }, [])


    return (
        <div className='comment-box' style={{marginLeft:30}} >
        <Link to={`/creator/${writerId}`}>
        <Avatar style={{height:40,width:40,flexShrink: 0}} imgProps={{crossOrigin:"anonymus"}} src={replyAvatar} />
      </Link>
      <div style={{marginLeft:10}}>
          <div style={{display: 'flex', alignItems: 'center',marginBottom:5}}>
          <h4 style={{fontSize:12,marginRight:10}}>{replyUserName}</h4>
          <hr style={{ display: 'inline-block', width: '100%', marginLeft: 10,opacity:0.2 }} />
       
          </div>
      
      
      <h6 style={{maxWidth: 1000,minWidth:1000,fontSize:13,fontWeight:500}}>{replyText}</h6>
      
      <div style={{display:"flex",flexDirection:"row",marginTop:10}}>
      
      {/*LIKE BUTTON*/}
      <div
        onClick={() =>{
      
          handleReplyLikeLogic()
          }}
          style={{display:"flex",flexDirection:"row"}}
      >
      {isReplyLiked ? (
          <FavoriteIcon style={{color:"rgb(241, 88, 88)"}} className='comment-feedback-icons'/>
        ) : (
          <FavoriteBorderIcon className='comment-feedback-icons' />
        )}
          <h6>{replyLikesArray.length}</h6>
        </div>
      
      {/*DISLIKE BUTTON*/}
        <div
        onClick={() =>{
      
          handleReplyDisLikeLogic()
          }}
        style={{marginLeft:10,display:"flex",flexDirection:"row"}}
      >
      {isReplyDisLiked ? (
          <HeartBrokenIcon style={{ color: "rgb(172, 0, 0)"}} className='comment-feedback-icons-dislike' />
        ) : (
          <HeartBrokenIcon className='comment-feedback-icons-dislike' />
        )}
        <h6>{replyDisLikesArray.length}</h6>
        </div>
      
      {/*REPLY BUTTON*/}
          <div style={{marginLeft:10,cursor:"pointer"}} onClick={() => handleReplingToReplypass(replyUserName)}>
            {!isRepling ? 
             <h6 style={{fontSize:13,fontWeight:500}}>Reply</h6>:null
            }
       
          </div>
      
      </div>
      </div>   
      
      </div>
    )
}

export default ReplyCommentBox