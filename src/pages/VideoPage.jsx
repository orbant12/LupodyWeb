
import React,{useEffect, useState} from 'react'
import "../Css/videoPage.css"
import FrameVideo from '../assets/File/videoFrame';
import Avatar from '@mui/material/Avatar';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ModeSelect from "../assets/videoPage/modeSelector"
import CustomizedRating from "../assets/videoPage/rateUi"
import ReplyIcon from '@mui/icons-material/Reply';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CommentBox from "../assets/videoPage/commentBox"
import testImage from "../assets/Images/bugs-image.jpg"
import MusicPlayerSlider from "../assets/videoPage/musicPlayer"
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, getDoc, getDocs, setDoc,deleteDoc,query,limit,limitToLast,startAfter,endBefore,orderBy,updateDoc } from 'firebase/firestore';
import LinkPopUp from "../assets/videoPage/linkPopUp"
import RecommendFrame from "../assets/videoPage/recommendFrame"
import { useAuth } from '../context/UserAuthContext';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DescriptionField from "../assets/videoPage/descriptionField"


const VideoPage = () => {

const [isAudioOnly, setIsAudioOnly] = useState(true)

const { id } = useParams()

const { currentuser } = useAuth();

const [userComment, setUserComment] = useState("")

const handleUserComment = (e) => {
    setUserComment(e.target.value)

}

const [videoData, setVideoData] = useState([])
const [uploaderData, setUploaderData] = useState([])
const [commentData, setCommentData] = useState([])
const [userData, setUserData] = useState([])

const [isFollowed, setIsFollowed] = useState(false)
//USER OWN RATING
const [isLiked, setIsLiked] = useState(0)
const [followerArray, setFollowerArray] = useState([])


//ALL RATING LOGIC
const [ratingValue, setRatingValue] = useState(0)
//ALL RATING NUMBER
const [ratingNumber, setRatingNumber] = useState(0)

//RATING ATTACHMENT LOGIC TO COMMENT
const [isRatingAttached, setIsRatingAttached] = useState(false)

//MODAL
const [isModalActive, setIsModalActive] = useState(false)

//WATCH LATER
const [watchLater, setWatchLater] = useState(false)

//RECOMMENDED VIDEOS
const [preLoadedVideosRecommend, setPreLoadedVideosRecommend] = useState([])
const [lastDocumentRecommend, setLastDocumentRecommend] = useState(null)
const [firstDocumentRecommend, setFirstDocumentRecommend] = useState(null)


//2ND STAGE FETCHES._____________________________

const fetchUploaderData = async (uploader) => {
   if(uploader != null){
      const uploaderRef = doc(db, "users", uploader);
      const uploaderSnap = await getDoc(uploaderRef);
      if (uploaderSnap.exists()) {
         await setUploaderData(uploaderSnap.data())
      
      } else {
         // doc.data() will be undefined in this case
         console.log("No such document!");
   
      }
   
   }
}

const fetchFollowers = async (uploader) => {
   const followerRef = collection(db, "users", uploader,"Followers");
   const followerSnap = await getDocs(followerRef);
   const followerList = followerSnap.docs.map(doc => doc.data());
   setFollowerArray(followerList)
   const userRef = doc(db, "users", uploader);
   await updateDoc(userRef, {
      followers: followerList.length
   });
   
   if (followerList.some(follower => follower.id === currentuser.uid)) {
      setIsFollowed(true)
   }

}

const fetchVideoRating = async () => {
   const ratingRef = collection(db, "videos", id,"rating");
    //RATING COLLECTIONS FETCH
    const ratingSnap = await getDocs(ratingRef);
    let sum = 0;
    let count = 0;
    
    if (ratingSnap.empty) {
      console.log('No matching documents.');
    } else {
      ratingSnap.forEach((doc) => {
       
          sum += doc.data().rate;
          count += 1;
        
      });
    
      if (count > 0) {
        const averageRating = sum / count;
        setRatingNumber(count)
        setRatingValue(averageRating);
      } else {
        console.log('No matching documents for the current user.');
      }
 
    }
  
    const rateList = ratingSnap.docs.map(doc => doc.data());
    if (rateList.some(like => like.id === currentuser.uid)) {
      const userRate = rateList.find(like => like.id === currentuser.uid).rate;
      setIsLiked(userRate);
    }
    
}


//FETCHING CODES._____________________________

const fetchVideoData = async () => {
//FIREBASE FETCH
   const videoRef = doc(db, "videos", id);
   const commentRef = collection(db, "videos", id,"comments");

   const videoSnap = await getDoc(videoRef);
   if (videoSnap.exists()) {
      await setVideoData(videoSnap.data())
      fetchUploaderData(videoSnap.data().uploader_id)
      fetchFollowers(videoSnap.data().uploader_id)
   } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
   }
   
   //COMMENTS COLLECTIONS FETCH
   const commentSnap = await getDocs(commentRef);
   if (commentSnap.empty) {
     console.log('No matching documents.');
   } else {
     const newCommentData = commentSnap.docs.map(doc => doc.data());
     setCommentData([...commentData, ...newCommentData]);
   }
   

   fetchVideoRating()

  
   
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

//BUSINESS VIDEOS._____________________________
const preLoadRecommendedVideos= async () => {
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field), limit(pageSize));
    const querySnapshot = await getDocs(q)
    //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    const firstVisible = querySnapshot.docs[0];
    setLastDocumentRecommend(lastVisible);
    setFirstDocumentRecommend(firstVisible);
    setPreLoadedVideosRecommend(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    console.log("FIRST DOCUMENT",firstVisible)
    console.log("LAST DOCUMENT",lastVisible)
    console.log("PRELOADED VIDEOS",preLoadedVideosRecommend)
}

const showPaginationNextRecommendedVideos = async () => {
   //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),startAfter(lastDocumentRecommend), limit(pageSize));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocumentRecommend(lastVisible);
      setFirstDocumentRecommend(firstVisible);
      setPreLoadedVideosRecommend(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideosRecommend)
}

const showPaginationPrevRecommendedVideos = async () => {
      //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
      const pageSize = 4;
      const field = "video_category";
      const ref = collection(db, "videos");
   
      const q = query(ref, orderBy(field),endBefore(firstDocumentRecommend), limitToLast(pageSize));
            const querySnapshot = await getDocs(q)
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            const firstVisible = querySnapshot.docs[0];
            setLastDocumentRecommend(lastVisible);
            setFirstDocumentRecommend(firstVisible);
            setPreLoadedVideosRecommend(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
            console.log("FIRST DOCUMENT",firstVisible)
            console.log("LAST DOCUMENT",lastVisible)
            console.log("PRELOADED VIDEOS",preLoadedVideosRecommend)
}

const addView = async () => {
   //PUBLICK
   const videoRef = doc(db, "videos", id);
   //USER
   const userRef = doc(db, "users", currentuser.uid,"Videos",id);
   
   const userSnap = await getDoc(userRef);
   if (userSnap.exists()) {
      await updateDoc(userRef, {
         views: userSnap.data().views + 1
      });
   } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
   }
   const videoSnap = await getDoc(videoRef);
   if (videoSnap.exists()) {
      await updateDoc(videoRef, {
         views: videoSnap.data().views + 1
      });
   } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
   }

}


//FETCH ALL DATA WHEN PAGE LOADS OR REQUESTED._____________________________
useEffect(() => {
   fetchUserData()
   fetchVideoData()
   preLoadRecommendedVideos()
   addView()
}, [currentuser])



//BUTTON ACTIONS UNDER VIDEO._____________________________

const handleFollow = async () => {
if (isFollowed === false) {
   const userRef = doc(db, "users",videoData.uploader_id,"Followers",currentuser.uid);
   const uploaderRef = doc(db, "users",currentuser.uid,"Following",videoData.uploader_id);
   await setDoc(userRef,{
      id:currentuser.uid
   })
   await setDoc(uploaderRef,{
      id:videoData.uploader_id,
      avatar: uploaderData.profilePictureURL,
      fullname: uploaderData.fullname,
   })
   fetchFollowers(videoData.uploader_id)
   setIsFollowed(true)

}else if (isFollowed === true) {
   const userRef = doc(db, "users", videoData.uploader_id,"Followers",currentuser.uid);
   const uploaderRef = doc(db, "users",currentuser.uid,"Following",videoData.uploader_id);
   if(followerArray.some(follower => follower.id === currentuser.uid)){
      deleteDoc(userRef)
      deleteDoc(uploaderRef)
   }
   fetchFollowers(videoData.uploader_id)
   setIsFollowed(false)

}
}

const handleRating = async (value) => {
   const userRef = doc(db, "videos", id,"rating",currentuser.uid);
   if(Number(value) != isLiked){
   setDoc(userRef,{
      id:currentuser.uid,
      rate: Number(value)
   })
   fetchVideoRating()
}else if(Number(value) == isLiked){
   await deleteDoc(userRef)
   setIsLiked(0)
   setRatingNumber(ratingNumber - 1)
   fetchVideoRating()
}

}


const handleCommentSend = async () => {
   const commentUID = Math.random().toString(36).substr(2, 16);
   const commentRef = doc(db, "videos", id,"comments",commentUID);
   const commentText = userComment;
   const commentRate = isRatingAttached ? isLiked : 0;
   const commentWriter = currentuser.uid;
   const commentWriterName = userData.user_name;
   const commentWriterProfilePicture = userData.profilePictureURL;
   const commentDate = new Date().toLocaleDateString();
   const commentTime = new Date().toLocaleTimeString();

     // Data to be set in the comment document
  const commentData = {
   id: commentUID,
   text: commentText,
   rate: commentRate,
   writer_id: commentWriter,
   user_name: commentWriterName,
   profilePicture: commentWriterProfilePicture,
   date: commentDate,
   time: commentTime,
 };
 try {
   // Set the data in the comment document
   await setDoc(commentRef, commentData);

   // Update the local state with the new comment data
   setCommentData((prevCommentData) => [...prevCommentData, commentData]);

   console.log("Comment Sent");
   setUserComment("")
   setIsRatingAttached(false)
 } catch (error) {
   console.error("Error sending comment:", error.message);
 }
}


const handleClipping = async () => {
   setIsModalActive(true)
}


const handleWatchLater = async () => {
   //REF TO WATCH LATER
   const watchLaterRef = doc(db, "users", currentuser.uid,"Watch-Later",id);
   //SAVE TO FIRESTORE
   await setDoc(watchLaterRef,{
      id:id
   })
   setWatchLater(true)
}

const handleWatchLaterDelete = async () => {
   //REF TO WATCH LATER
   const watchLaterRef = doc(db, "users", currentuser.uid,"Watch-Later",id);
   //SAVE TO FIRESTORE
   await deleteDoc(watchLaterRef)
   setWatchLater(false)

}

const handleShare = async () => {
   if (navigator.share) {
      navigator.share({
        title: `${videoData.title} - ${uploaderData.user_name}`,
        url: `http://localhost:5173/${id}`
      }).then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
    } else {
      console.log(`Your system doesn't support sharing files.`);
    }

}






return (

<div className='home'>

    {/*MODAL*/}
    {isModalActive?(
      <div className='modal'>
      <LinkPopUp userData={userData} setIsLinkpass={setIsModalActive} podcastURL={videoData.video}/>
   </div>
    ):null
    }
   {/*PAGE*/}
      <div className='f-row-v-page'>

        <div className='modeSelect-v'>
        <ModeSelect setAudioOnly={setIsAudioOnly}/>
        </div>


        <div className='middle-part-v' >
            {!isAudioOnly ? (
                <div className='main-a'>
                <MusicPlayerSlider userName={"Joe Rogan"} podcastCover={testImage} podcastTitle={"Who Tf Is Giga Ni**a -IShowSpeedsdasdas dsdsdsdsdsd sdsdsds"} />
                </div>
            ):(
        

                <FrameVideo className="main-v" videoSrc={videoData.video} />
            
            )}


        <div className='description-v'>
            <div className='description-l'>
            <h1 style={{maxWidth: "660px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{videoData.title}</h1>
            <div style={{display:"flex",flexDirection:"row",width:300,justifyContent:"space-evenly",alignItems:"center",marginLeft:10,marginTop:10}}>

               <Link to={`/creator/${uploaderData.id}`}>
            <Avatar style={{height:50,width:50,flexShrink: 0}} imgProps={{crossOrigin:"anonymus"}} src={uploaderData.profilePictureURL} />
            </Link>
            <div style={{marginLeft:5,flexShrink: 1,maxWidth: 180}}>
            <h4 style={{fontWeight: 600, maxWidth: 180,minWidth:150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{uploaderData.fullname}</h4>
            <h5 style={{fontWeight:600}}><span>{followerArray.length}</span> Followers</h5>
            </div>
            <div className='follow-btn' style={{ backgroundColor: "#1DA1F2" }} onClick={handleFollow}>
               {isFollowed ? (
                  <h5 style={{fontWeight:600}}>Unfollow</h5>
               ):(
                  <h5 style={{fontWeight:600}}>Follow</h5>
               )}
              
            </div>
           
            </div>
            {!videoData.uploader_id === userData.id ? (
               <h5 className='custom-action-btn' style={{ marginTop:30, backgroundColor: "lightblue",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} onClick={()=> window.location.href = "/creator-page/videos"} ><span><AutoFixHighIcon sx={{ color: "#1DA1F2",marginRight:6 }} /></span>Edit All Video Details</h5>
            ):null
            }
            
            </div>

            <div className='description-r'>
               
            <h5 className='custom-action-btn' style={{ backgroundColor: "lightblue",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} onClick={handleShare} ><span><ReplyIcon sx={{ color: "#1DA1F2" }} /></span>Share</h5>
            <h5 className='custom-action-btn' style={{ backgroundColor: "lightblue",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} onClick={handleClipping}><span><BookmarkAddIcon sx={{ color: "#1DA1F2" }} /></span>Clip</h5>
            {watchLater ? (
            <h5 className='custom-action-btn' onClick={handleWatchLaterDelete} style={{ backgroundColor: "#1DA1F2"}}>
            <span><WatchLaterIcon sx={{ color: "lightblue" }} /></span> Added
          </h5>
          
            ):(
               <h5 className='custom-action-btn' style={{ backgroundColor: "lightblue",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}} onClick={handleWatchLater} ><span><WatchLaterIcon sx={{ color: "#1DA1F2" }} /></span> Watch Later</h5>
            )
               }
           
            <div style={{display:"flex",flexDirection:"column",minHeight:10,marginTop:30,textAlign:"right"}}>
            <CustomizedRating setRatingValuePass={handleRating} defaultValuePass={isLiked}  />
            <h6 style={{fontWeight:500}}>Number of Rates: {ratingNumber}</h6>
            <h3>{ratingValue}<span style={{fontWeight:200,fontSize:11}}> Rate</span></h3>
            </div>
     
    
      
            </div>
     
        </div>

        <div className='comments-v'>
         <div style={{marginBottom:40}}>
         <DescriptionField videoDescription={videoData.description} videoCreatedAt={videoData.created_at} videoViews={videoData.views} />
       
         </div>
       
         <hr style={{borderStyle:"groove",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",marginBottom:10}} />
            <h1><span>{commentData.length}</span> Comments</h1>
            <div className='comment-box'>
<Avatar style={{height:40,width:40,flexShrink: 0}} imgProps={{crossOrigin:"anonymus"}} src={userData.profilePictureURL} />
    <div style={{marginLeft:10}}>
    <div style={{display: 'flex', alignItems: 'center'}}>
    <input type="text" onChange={handleUserComment} value={userComment} className='comment_input' placeholder='Write a comment' />
    </div>

{userComment.length > 0 ?
    <div style={{display:"flex",flexDirection:"row",justifyContent:"right",marginTop:10}}>




    <div style={{marginRight:10}} onClick={() => setIsRatingAttached(!isRatingAttached)}>
      {isRatingAttached ? (
         <h6 className='comment-btns'style={{fontSize:13,fontWeight:500,backgroundColor:"green",color:"white"}}>Rating Attached</h6>
      ):(
         <h6 className='comment-btns' style={{fontSize:13,fontWeight:500}}>Attach Rating</h6>
      )}

    </div>
    
    <div style={{marginRight:10,textAlign:"right"}} onClick={handleCommentSend}>
    <h6 className='comment-btns'>Send</h6>
    </div>

</div>:null
}




</div>   
            </div> 
      
            <div className='comment-container' >
              {commentData.map((comment) => (
               <div key={comment.id}>
                   <CommentBox  userComment={comment.text} userTag={comment.user_name} commentRate={comment.rate} likeCount={comment.like} diskLikeCount={comment.dislike} userVisitId={comment.writer_id} commentAvatar={comment.profilePicture} commentID={comment.id} videoID={id} />
               </div>
              ))}
         
            </div>
      
        </div>
        </div>
      

         <div className="video-page-container">
            <div onClick={showPaginationPrevRecommendedVideos}>
            <KeyboardArrowUpIcon  style={{marginBottom:-30,border: '2px solid #1DA1F2',marginRight:10,borderRadius: '50%',cursor:"pointer"}}  />
            </div>
               {preLoadedVideosRecommend.map((video) => (
                  
                      <RecommendFrame  videoID={video.data.id} videoIntro={video.data.intro} videoTitle={video.data.title} videoThubnail={video.data.thubnail} uploader_fullname={video.data.uploader_fullname}/>
            
                 
               ))}

   
            <div onClick={showPaginationNextRecommendedVideos}>
            <KeyboardArrowUpIcon
        style={{
          marginTop: 70,
          transform: 'rotate(180deg)', // Rotate 180 degrees
          border: '2px solid #1DA1F2', // Green circle border
          borderRadius: '50%', // Make it a circle
          cursor:"pointer"
        }}
      />
            </div>
         </div>
      </div>
      </div>


)
}
    export default VideoPage