import React, { useState, useEffect } from 'react';
import { auth,db } from "./firebase";
import { signOut } from 'firebase/auth';
import { useAuth } from './context/UserAuthContext';
import {  collection, doc, getDocs,getDoc} from "firebase/firestore";
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

function SideBar({themeSwitch}) {

const { currentuser } = useAuth();

//CURRENT USER DATA
const [UserData, setUserData] = useState([]);
  

//SideBr toggle
const body = document.querySelector('body'),
sidebar = body.querySelector('nav.sidebar')

const barToggle = () => {
    sidebar.classList.toggle("close");
};

//FOLLOWING
const [followings, setFollowings] = useState([]);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);



const fetchFollowings = async () => {
  if (currentuser) {
    const currentUserId = currentuser.uid;
    const followingsRef = collection(db, 'users', currentUserId, 'Following');

    try {
      const followingsSnapshot = await getDocs(followingsRef);

      const followingsArray = followingsSnapshot.docs.map((doc) => doc.data());
      
      setFollowings(followingsArray);
      console.log(followingsArray);
    } catch (error) {
      console.error('Error fetching followings:', error);
      setFollowings([]);
    }
  }
};




useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentuser) {
          const currentUserId = currentuser.uid;
          const userDocRef = doc(db, "users", currentUserId);
          
          const docSnapshot = await getDoc(userDocRef);
  
          if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const elementData = docSnapshot.data();
            setUserData(elementData);
          } else {
            console.log("Document does not exist.");
            setUserData(null); // Set to null or handle accordingly
          }
        } 
      } catch (error) {
        console.error("Error getting document: ", error);
      }
    };
    // Call fetchData
    fetchFollowings();
    fetchData();
  }, [currentuser]);

//SIGN OUT
const userSignOut = async() => {
        signOut(auth);
        console.log("logged out")
       
    };


return ( 
<div>
    <div className='sidebaropener'>
        <MenuIcon onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="sidebar" style={isSidebarOpen?{display:"block"}:null} >
        <header>
            <div className="image-text">
                <div className='userURL'>
                    <Avatar alt={UserData.fullname} src={UserData.profilePictureURL} imgProps={{ crossOrigin: "anonymous" }} />
                </div>
                <div className="text logo-text">
                    <p className="name">{UserData.fullname}</p>
                    <span className="profession">Plan: {!UserData.subscription?<span>Free</span>:<span>Premium</span>}</span>
                </div>
            </div>
            <i className='bx bx-chevron-right toggle' onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </header>
        <div className="menu-bar">
            <div className="menu">
                <ul className="menu-links">
                    <li className="nav-link" >
                        <a href="/" >
                            <i className='bx bx-home icon' crossOrigin="anonymus" />
                            <span className="text nav-text" >Home</span>
                        </a>
                    </li>
                    <li className="nav-link">
                        <a href="/memory" className="router">
                            <i className='bx bx-brain icon' crossOrigin="anonymus" />
                            <span className="text nav-text">Your Memory</span>
                        </a>
                    </li>
                    <li className="nav-link">
                        <a href="/policies" className="router">
                            <i className='bx bx-question-mark icon' crossOrigin="anonymus" />
                            <span className="text nav-text">Help</span>
                        </a>
                    </li>
                    <li className="nav-link">
                        <a href="/subscription">
                            <i className='bx bx-money icon' crossOrigin="anonymus" ></i>
                            <span className="text nav-text">Subscription</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="bottom-content">
                <li className="">
                    <a href="/settings">
                        <i className='bx bx-cog icon' crossOrigin="anonymus" ></i>
                        <span className="text nav-text">Settings</span>
                    </a>
                </li>
                <li className="">
                    <a href="/login" onClick={userSignOut}>
                        <i className='bx bx-log-out icon' crossOrigin="anonymus" ></i>
                        <span className="text nav-text">Logout</span>
                    </a>
                </li>
                <li className="mode">
                    <div className="sun-moon">
                        <i className='bx bx-moon icon moon' crossOrigin="anonymus"></i>
                        <i className='bx bx-sun icon sun' crossOrigin="anonymus"></i>
                    </div>
                    <span className="mode-text1 text">Dark mode</span>
                    <span className="mode-text2 text">Light mode</span>
                    <div className="toggle-switch">
                        <span className="switch" onClick={themeSwitch}></span>
                    </div>
                </li> 
            </div>
        </div>
        </div>
    </div>

    <nav className="sidebar close" >
    <header>
        <i className='bx bx-chevron-right toggle' onClick={barToggle} />
    </header>
    <div className="menu-bar">
        <div className="menu">
          
            <ul className="menu-links">
              <li className="nav-link" >
                  <a href="/" >
                      <i className='bx bx-home icon' crossOrigin="anonymus" />
                      <span className="text nav-text" >Home</span>
                  </a>
              </li>
                <li className="nav-link">
                    <a href={`/creator/${UserData.id}`} className="router">
                        <i className='bx bx-microphone icon' crossOrigin="anonymus" />
                        <span className="text nav-text">Your Podcast</span>
                    </a>
                </li>
                <li className="nav-link">
                    <a href="https://clippify.net" className="router">
                        <i className='bx bx-tv icon' crossOrigin="anonymus" />
                        <span className="text nav-text">Clips</span>
                    </a>
                </li>
                <li className="nav-link">
                    <a href="/creator/watch-later">
                        <i className='bx bx-time icon' crossOrigin="anonymus" ></i>
                        <span className="text nav-text">Watch Later</span>
                    </a>
                </li>
        <hr style={{marginTop:10}}/>
                <li className="nav-link">
                
                        <i className='bx bx-user icon' crossOrigin="anonymus" ></i>
                        <span className="text nav-text">Followed</span>
            
                </li>

                {followings.map((follow) => (
                    <Link to={`/creator/${follow.id}`}>
                    <li className="nav-link" style={{marginLeft:10,marginRight:10}}>
                    
                        <Avatar imgProps={{crossOrigin:"anonymous"}} src={follow.avatar} />
                        <span className="text nav-text" style={{color:"black",marginLeft:10,maxWidth:140,minWidth:100,overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap',}}>{follow.fullname}</span>
                      
                    </li>
                    </Link>
                ))}

      

                <li className="nav-link">
                    <a href="/subscription">
                        <i className='bx bx-show icon' crossOrigin="anonymus" ></i>
                        <span className="text nav-text">Show More</span>
                    </a>
                </li>
              
                
            </ul>
        </div>
        <div className="bottom-content">
          <li className="">
              <a href="/settings">
                  <i className='bx bx-cog icon' crossOrigin="anonymus" ></i>
                  <span className="text nav-text">Settings</span>
              </a>
          </li>
            <li className="">
                <a href="/login" onClick={userSignOut}>
                    <i className='bx bx-log-out icon' crossOrigin="anonymus" ></i>
                    <span className="text nav-text">Logout</span>
                </a>
            </li>
            <li className="mode">
                <div className="sun-moon">
                    <i className='bx bx-moon icon moon' crossOrigin="anonymus"></i>
                    <i className='bx bx-sun icon sun' crossOrigin="anonymus"></i>
                </div>
                <span className="mode-text1 text">Dark mode</span>
                <span className="mode-text2 text">Light mode</span>
                <div className="toggle-switch">
                    <span className="switch" onClick={themeSwitch}></span>
                </div>
            </li>
            
        </div>
    </div>
    </nav>

</div>
)
}


export default SideBar

