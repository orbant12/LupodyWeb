//CSS
import "../Css/login.css"
import "../Css/styles.css"
import { Link } from "react-router-dom";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

import science from "../Assets/Images/category_5.svg"
import health from "../Assets/Images/category_4.svg"
import mental from "../Assets/Images/category_2.svg"
import sport from "../Assets/Images/category_1.svg"
import games from "../Assets/Images/category_3.svg"
import talk from "../Assets/Images/category_7.svg"
import solo from "../Assets/Images/category_8.svg"
import game from "../Assets/Images/game-cat-fix.svg"
import sports from "../Assets/Images/sport-test-3.svg"
import tech from "../Assets/Images/12.svg"
import appleSVG from "../Assets/Images/download-on-the-app-store-apple-logo-svgrepo-com.svg"
import googleSVG from "../Assets/Images/google-play-download-android-app-logo-svgrepo-com.svg"

import lupody_logo from "../Assets/Images/Lupody-Logo.svg"
import instaIcon from "../Assets/Images/instagram-1-svgrepo-com.svg"
import titokIcon from "../Assets/Images/tiktok-icon-white-1-logo-svgrepo-com.svg"
import twitterIcon from "../Assets/Images/twitter-svgrepo-com.svg"
import youtubeIcon from "../Assets/Images/youtube-color-svgrepo-com.svg"
//FIREBASE
import {db} from "../firebase"
import { collection,limit,orderBy, query,getDocs, limitToLast, startAfter, endBefore, where } from 'firebase/firestore';

//REACT
import React, {useEffect, useState,useRef} from "react"

//ASSETS AND IMAGES AND ICONS
import VideoRecomendFrame from "../assets/UserProfile/videoRecomendFrame.jsx"
import FypSection from "../assets/landingPage/fypSection.jsx";
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {

   //JUST TALKING VIDEOS
   const [lastDocument, setLastDocument] = useState(null);
   const [firstDocument, setFirstDocument] = useState(null);
   const [preLoadedVideos, setPreLoadedVideos] = useState([])

   //HEALTH VIDEOS
   const [lastDocumentHealth, setLastDocumentHealth] = useState(null);
   const [firstDocumentHealth, setFirstDocumentHealth] = useState(null);
   const [preLoadedVideosHealth, setPreLoadedVideosHealth] = useState([])

   //BUSINESS VIDEOS
   const [lastDocumentBusiness, setLastDocumentBusiness] = useState(null);
   const [firstDocumentBusiness, setFirstDocumentBusiness] = useState(null);
   const [preLoadedVideosBusiness, setPreLoadedVideosBusiness] = useState([])

   //MIX ROW 1
   const [preLoadedVideosMixRow1, setPreLoadedVideosMixRow1] = useState([])

   //FOR YOU SECTION
   const [preLoadedVideosForYou, setPreLoadedVideosForYou] = useState([])
   const [lastDocumentForYou, setLastDocumentForYou] = useState(null);

   const [visible, setVisible] = useState(false);
   const [ref, inView] = useInView({
     triggerOnce: true,
   });

   useEffect(() => {
      if (inView) {
        // Set visible to true to render the videos
        setVisible(true);
        // Fetch more videos if needed
        // Example: fetchMoreVideos();
      }
    }, [inView]);
//MIX ROW 1

const preLoadVideosMixRow1 = async () => {
   const pageSize = 10;
   const field = "views";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field,"desc"),limit(pageSize));
    const querySnapshot = await getDocs(q)
    //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    const firstVisible = querySnapshot.docs[0];
    setPreLoadedVideosMixRow1(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    console.log("FIRST DOCUMENT",firstVisible)
    console.log("LAST DOCUMENT",lastVisible)
    console.log("PRELOADED VIDEOS",preLoadedVideos)


}


//BUSINESS VIDEOS
const preLoadVideosBusiness = async () => {
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),where(field, "==", "Business"), limit(pageSize));
    const querySnapshot = await getDocs(q)
    //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    const firstVisible = querySnapshot.docs[0];
    setLastDocumentBusiness(lastVisible);
    setFirstDocumentBusiness(firstVisible);
    setPreLoadedVideosBusiness(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    console.log("FIRST DOCUMENT",firstVisible)
    console.log("LAST DOCUMENT",lastVisible)
    console.log("PRELOADED VIDEOS",preLoadedVideos)
}

const showPaginationNextBusiness = async () => {
   //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),where(field, "==", "Business"),startAfter(lastDocumentBusiness), limit(pageSize));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocumentBusiness(lastVisible);
      setFirstDocumentBusiness(firstVisible);
      setPreLoadedVideosBusiness(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideos)
}

const showPaginationPrevBusiness = async () => {
      //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
      const pageSize = 4;
      const field = "video_category";
      const ref = collection(db, "videos");
   
      const q = query(ref, orderBy(field),where(field, "==", "Business"),endBefore(firstDocumentBusiness), limitToLast(pageSize));
            const querySnapshot = await getDocs(q)
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            const firstVisible = querySnapshot.docs[0];
            setLastDocumentBusiness(lastVisible);
            setFirstDocumentBusiness(firstVisible);
            setPreLoadedVideosBusiness(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
            console.log("FIRST DOCUMENT",firstVisible)
            console.log("LAST DOCUMENT",lastVisible)
            console.log("PRELOADED VIDEOS",preLoadedVideos)
}

   //HEALTH VIDEOS
const preLoadVideosHealth = async () => {
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),where(field, "==", "Health"), limit(pageSize));
    const querySnapshot = await getDocs(q)
    //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

    const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
    const firstVisible = querySnapshot.docs[0];
    setLastDocumentHealth(lastVisible);
    setFirstDocumentHealth(firstVisible);
    setPreLoadedVideosHealth(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    console.log("FIRST DOCUMENT",firstVisible)
    console.log("LAST DOCUMENT",lastVisible)
    console.log("PRELOADED VIDEOS",preLoadedVideos)

}

const showPaginationNextHealth = async () => {
   //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 4;
   const field = "video_category";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),where(field, "==", "Health"),startAfter(lastDocumentHealth), limit(pageSize));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocumentHealth(lastVisible);
      setFirstDocumentHealth(firstVisible);
      setPreLoadedVideosHealth(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideos)
   
    
};

const showPaginationPrevHealth = async () => {
    //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
    const pageSize = 4;
    const field = "video_category";
    const ref = collection(db, "videos");

     const q = query(ref, orderBy(field),where(field, "==", "Health"),endBefore(firstDocumentHealth), limitToLast(pageSize));
         const querySnapshot = await getDocs(q)
         const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
         const firstVisible = querySnapshot.docs[0];
         setLastDocumentHealth(lastVisible);
         setFirstDocumentHealth(firstVisible);
         setPreLoadedVideosHealth(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
         console.log("FIRST DOCUMENT",firstVisible)
         console.log("LAST DOCUMENT",lastVisible)
         console.log("PRELOADED VIDEOS",preLoadedVideos)
};


//JUST TALKING VIDEOS
   const preLoadVideos = async () => {
     const pageSize = 4;
     const field = "video_category";
     const ref = collection(db, "videos");

      const q = query(ref, orderBy(field),where(field, "==", "Just Talk"), limit(pageSize));
      const querySnapshot = await getDocs(q)
      //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocument(lastVisible);
      setFirstDocument(firstVisible);
      setPreLoadedVideos(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideos)
    };
   
    

   const showPaginationNext = async () => {
      //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
      const pageSize = 4;
      const field = "video_category";
      const ref = collection(db, "videos");
 
       const q = query(ref, orderBy(field),where(field, "==", "Just Talk"),startAfter(lastDocument), limit(pageSize));
         const querySnapshot = await getDocs(q)
         const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
         const firstVisible = querySnapshot.docs[0];
         setLastDocument(lastVisible);
         setFirstDocument(firstVisible);
         setPreLoadedVideos(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
         console.log("FIRST DOCUMENT",firstVisible)
         console.log("LAST DOCUMENT",lastVisible)
         console.log("PRELOADED VIDEOS",preLoadedVideos)
      
       
   };

   const showPaginationPrev = async () => {
       //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
       const pageSize = 4;
       const field = "video_category";
       const ref = collection(db, "videos");
  
        const q = query(ref, orderBy(field),where(field, "==", "Just Talk"),endBefore(firstDocument), limitToLast(pageSize));
            const querySnapshot = await getDocs(q)
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
            const firstVisible = querySnapshot.docs[0];
            setLastDocument(lastVisible);
            setFirstDocument(firstVisible);
            setPreLoadedVideos(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
            console.log("FIRST DOCUMENT",firstVisible)
            console.log("LAST DOCUMENT",lastVisible)
            console.log("PRELOADED VIDEOS",preLoadedVideos)
   };


//FOR YOU SECTION
   
const preLoadVideosForYou = async () => {
   const pageSize = 10;
   const field = "views";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),limit(1));
    const querySnapshot = await getDocs(q)
    //SEPERATION ONLY JUST TALKING VIDEOS CATGEORY

    const firstVisible = querySnapshot.docs[0];
   const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];

    setLastDocumentForYou(lastVisible);
    setPreLoadedVideosForYou(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));

    console.log("FIRST DOCUMENTssssssssssss",firstVisible)
    console.log("LAST DOCUMENT",lastVisible)
    console.log("PRELOADED VIDEOS",preLoadedVideosForYou)
}

const handleForyouNext = async () => {
   //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 10;
   const field = "views";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),startAfter(lastDocumentForYou), limit(1));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocumentForYou(lastVisible);
    
      setPreLoadedVideosForYou(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));

      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideosForYou)


}

const handleForyouPrev = async () => {
   //SHOW NEXT 4 VIDEOS When Clicked with limitToLast()
   const pageSize = 10;
   const field = "views";
   const ref = collection(db, "videos");

    const q = query(ref, orderBy(field),endBefore(lastDocumentForYou), limitToLast(1));
      const querySnapshot = await getDocs(q)
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
      const firstVisible = querySnapshot.docs[0];
      setLastDocumentForYou(lastVisible);
    
      setPreLoadedVideosForYou(querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
      console.log("FIRST DOCUMENT",firstVisible)
      console.log("LAST DOCUMENT",lastVisible)
      console.log("PRELOADED VIDEOS",preLoadedVideosForYou)

}

useEffect(() => {
   preLoadVideosBusiness()
   preLoadVideosHealth()
   preLoadVideos()
   preLoadVideosMixRow1()
   preLoadVideosForYou()
},[])



return(

<div className="home">
      {/*NAV HEADER*/}

   
      {/*FYP SECTION*/}
      {preLoadedVideosForYou.length > 0 &&(
         preLoadedVideosForYou.map((video) => (
            <FypSection videoId={video.data.id} videoCategory={video.data.video_category} videoTitle={video.data.title} videoURL={video.data.video} uploaderID={video.data.uploader_id} handleForyouNextpass={handleForyouNext} handleForyouPrevpass={handleForyouPrev} />
             ))
             )}



      {/*CATEGORIES SECTION*/}

      <div className="category-section">
      <hr style={{borderStyle:"dashed",opacity:0.2,marginTop:40,boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px",color:"#1DA1F2"}} />
         <h1>Top Categories</h1>
         <div className="category-container">
            <Link to={"/category/Talking"}>
               <div className="category-box" style={{backgroundImage:`url(${games})`,flexWrap:"nowrap"}}>
                  <h3 className="landing-text" style={{paddingRight:100}}>Talking</h3>
               </div>
            </Link>

            <Link to={"/category/Solo"}>
               <div className="category-box" style={{backgroundImage:`url(${sport})`,}}>
                  <h3 className="landing-text">Solo</h3>
               </div>
               </Link>

               <Link to={"/category/Health"}>
               <div className="category-box" style={{backgroundImage:`url(${solo})`}}>
                  <h3 className="landing-text">Health</h3>
               </div>
               </Link>

               <Link to={"/category/Sports"}>
               <div className="category-box" style={{backgroundImage:`url(${sports})`}}>
                  <h3 className="landing-text">Sports</h3>
               </div>
               </Link>

               <Link to={"/category/Tech"}>
               <div className="category-box" style={{backgroundImage:`url(${tech})`}}>
                  <h3 className="landing-text">Tech</h3>
               </div>
               </Link>
         </div>
         <div className="category-container">
         <Link to={"/category/Science"}>
               <div className="category-box" style={{backgroundImage:`url(${science})`}}>
               <h3 className="landing-text">Science</h3>
               </div>
               </Link>
               <Link to={"/category/News"}>

               <div className="category-box"style={{backgroundImage:`url(${health})`}}>
                  <h3 className="landing-text">News</h3>
               </div>
               </Link>
               <Link to={"/category/Comedy"}>

               <div className="category-box" style={{backgroundImage:`url(${mental})`}}>
                  <h3 className="landing-text">Comedy</h3>
               </div>
               </Link>
               <Link to={"/category/Gaming"}>
               <div className="category-box" style={{backgroundImage:`url(${game})`}} >
                  <h3 className="landing-text">Gaming</h3>
               </div>
               </Link>
               <Link to={"/category/Fitness"}>
               <div className="category-box" style={{backgroundImage:`url(${talk})`}}>
                  <h3 className="landing-text">Fitness</h3>
               </div>
               </Link>
         </div>
      </div>

       {/*CATEGORIES SECTION*/}

       <div className="recommend-section" ref={ref}>
      <hr style={{borderStyle:"groove",boxShadow:"#1DA1F2 0px 5px 15px",color:"#1DA1F2"}} />
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop:-50}}>
      <h1>Recommended Just Talk Podcasts</h1>
      <h6 style={{fontWeight:500,opacity:0.6}}>View More</h6>
      </div>
      {visible && (
         <div className="recommend-container" >
            <div onClick={showPaginationPrev} style={{ cursor: "pointer", transform: "rotate(180deg)",marginBottom:100}}
>
            <ArrowCircleRightIcon  />
            </div>
    
         {preLoadedVideos.length > 3 ? (
                   preLoadedVideos.map((video) => (
                     <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
                  ))
         ):(
            <div>
               <h3 style={{opacity:0.3,paddingBottom:80}}>Not Enough Video Uploaded</h3>
            </div>
         )}
  
           
           <div onClick={showPaginationNext} style={{cursor: "pointer",marginBottom:100}}>
            <ArrowCircleRightIcon  />
            </div>
         </div>
            )}
      </div>

      <div className="recommend-section">
      <hr style={{borderStyle:"groove",boxShadow:"#1DA1F2 0px 5px 15px",color:"#1DA1F2"}}  />
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop:-50}}>
      <h1>Recommended Health Podcasts</h1>
      <h6 style={{fontWeight:500,opacity:0.6}}>View More</h6>
      </div>
         <div className="recommend-container">
        
         <div onClick={showPaginationPrevHealth} style={{ cursor: "pointer", transform: "rotate(180deg)",marginBottom:100}}
>
            <ArrowCircleRightIcon  />
            </div>
    
      {preLoadedVideosHealth.length > 2 ? (
         preLoadedVideosHealth.map((video) => (
            <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
         ))
      ):(
         <div>
         <h3 style={{opacity:0.3,paddingBottom:80}}>Not Enough Video Uploaded</h3>
      </div>
      )}
           
           <div onClick={showPaginationNextHealth} style={{cursor: "pointer",marginBottom:100}}>
            <ArrowCircleRightIcon  />
            </div>  
             
         </div>
      </div>

      <div className="recommend-section">
      <hr style={{borderStyle:"groove",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}  />
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop:-50}}>
      <h1>Recommended Business Podcasts</h1>
      <h6 style={{fontWeight:500,opacity:0.6}}>View More</h6>
      </div>
         
         <div className="recommend-container">
         <div onClick={showPaginationPrevBusiness} style={{ cursor: "pointer", transform: "rotate(180deg)",marginBottom:100}}
>
            <ArrowCircleRightIcon  />
            </div>
    
         {preLoadedVideosBusiness.length > 2 ? (
         preLoadedVideosBusiness.map((video) => (
            <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
         ))
         ):(
            <div>
            <h3 style={{opacity:0.3,paddingBottom:80}}>Not Enough Video Uploaded</h3>
         </div>
         )}
           
           <div onClick={showPaginationNextBusiness} style={{cursor: "pointer",marginBottom:100}}>
            <ArrowCircleRightIcon  />
            </div>  
         </div>
         <hr style={{borderStyle:"groove",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}  />
      </div>

      <div className="recommend-section">
   
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:50,marginTop: 80}}>
      <h1>Recommended For You</h1>
      </div>
         {/*ROW 1*/}
         <div className="recommend-container2">

         {preLoadedVideosMixRow1.map((video) => (
            <VideoRecomendFrame videoID={video.data.id} videoTitle={video.data.title} videoThubnail={video.data.thubnail} videoIntro={video.data.intro} userAvatar={video.data.uploader_avatar} userFullName={video.data.uploader_fullname}/>
         ))}


         </div>

      </div>




      {/*FOOTER*/}
            <footer style={{alignSelf:"center", marginTop:500}} className="footer">
             <div className="container-footer">
                <div className="row">
                   <div className="footer-col">
                      <h4>company</h4>
                      <ul>
                         <li><a href="/support/contact-us">about us</a></li>
                         <li><a href="/policies/legal/terms">Terms of Use</a></li>
                         <li><a href="/policies/legal/privacy-policy">privacy policy</a></li>
                         
                      </ul>
                   </div>
                   <div className="footer-col">
                      <h4>get help</h4>
                      <ul>
                         <li><a href="/policies">FAQ</a></li>
                         <li><a href="/subscription">subscription</a></li>
                         <li><a href="/settings">cancel & returns</a></li>
                         <li><a href="/settings">payment options</a></li>
                      </ul>
                   </div>
                   <div className="footer-col">
                      <h4>Contact Us</h4>
                      <ul>
                         <li><a href="/support/contact-us">Customer Support</a></li>
                         <li><a href="/support/feedback">Any Questions ?</a></li>
                      </ul>
                   </div>
                   <div className="footer-col">
                      <h4>follow us</h4>
                      <div className="social-links">
                         <a href="#"><i className="fab fa-facebook-f"></i></a>
                         <a href="#"><i className="fab fa-twitter"></i></a>
                         <a href="https://www.instagram.com/echotheorca.app/"><i className="fab fa-instagram"></i></a>
                         <a href="https://www.youtube.com/channel/UCA5s3Bjs3MiXWnsg_Wn10hQ"><i className="fab fa-youtube"></i></a>
                      </div>
                   </div>
                </div>
             </div>
         </footer>
</div>

)
}

export default LandingPage