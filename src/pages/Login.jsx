//REACT AND CONTEXTS
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/UserAuthContext'

//CSS
import '../Css/styles.css'
import '../Css/sidebar.css'
import '../Css/login.css'

//FIREBAE
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db} from "../firebase";
import { collection, doc, getDocs, setDoc} from "firebase/firestore";


import bgImage from '../assets/Images/Login-Picture.png'

const Login = () => {
 

//REGISTER._________________________________________________//
const {SignUp, currentuser} = useAuth()

const [userNamesArray, setUserNamesArray] = useState([])
const [user, setUser] = useState({
  FullName: "",
  userName: "",
  email: "",
  password: "",
});


// GOOGLE PROVIDER__________________________//
const provider = new GoogleAuthProvider();
const googleSignIn = async () => {
  try{
    // "signInWithPopup" FUNCTION
    const result = await signInWithPopup(auth, provider);
    const curruser = result.user
    //FIRESTORE REF
    const colRef = collection(db, "users");
    //USER ID
    const customDocId = curruser.uid;
    //DISPLAY NAME
    const userFullname = curruser.displayName;
    //EMAIL
    const userName = "@"+"user"+Math.floor(Math.random() * 100000);
    const userEmail = curruser.email;
    //PROFILE IMG URL
    const  profilePictureURL = curruser.photoURL
    //TAG FIRESTORE REF
    const tagRef = collection(db, "users", customDocId, "Tags");
    const newTagRef = doc(tagRef);
    //TAG DEFAULT ADD
    const basicTag = {
      tags:[
        "None"
      ]
    };
    try{
      //SET USER DATA TO FIRESTORE
      await setDoc(doc(colRef, customDocId), {
        id: customDocId,
        fullname: userFullname,
        email: userEmail,
        subscription: false,
        profilePictureURL: profilePictureURL,
        storage_take: 0,
        user_since: new Date().toLocaleDateString(),
        followers: 0,
        description:"",
        user_name: userName,
      });
      //SETTING DEFAULT TAGS
      await setDoc(newTagRef,basicTag);
      console.log("Success Storing Google Document");
    } catch(err) {
      console.log(err)
      console.log("Failed Setting user Documents");
    };  
    console.log("Successful Login With Google");
  } catch(error) {
    console.log(error.message)
    console.log("Failed The signinwithPopup function");
  };
};



//REGISTER USER INPUT HANDLER
const UserHandler = (e) => {
  const { name, value } = e.target;
  console.log(name +"::::::::::"+value)
  setUser((pre) => {
    return {
      ...pre,
      [name]: value
    }
  });
};

//REGISTER SUBMIT HANDLER
const SubmitHandler = async (e) => {
  e.preventDefault()
  const { email, password, FullName, userName } = user;
  if (password == "" ||  email == "" || FullName == "" || userName == "") {
    alert("please fill All the field ")
  } else if (!password.length >= 6 ) {
    alert("Password Must be Greater then 6 Length")
  }else if (userNamesArray.includes(`@${userName}`)){
   alert("Username Already Taken")
  }else{
    SignUp(email, password, FullName, userName)
    { currentuser && setUser({
        FullName: "",
        userName: "",
        email: "",
        password: "",
      })
    };
  };
};

//FETCH ALL USERNAMES
useEffect(() => {
  const fetchUsernames = async () => {
    const colRef = collection(db, "users");
    const snapshot = await getDocs(colRef);
    const usernames = snapshot.docs.map(doc => doc.data().user_name);
    setUserNamesArray(usernames)
  };
  fetchUsernames();
}, []);

return (
<div id="login">
      <div id='login-mobile' style={{alignContent:"center"}}>
    <h1>Clippify is Avalible on Pc or Laptop !!</h1>
  </div>
  <div className="container-auth">
    
    <div className="forms">
        <div className="form-content">
        <div className="cover" style={{backgroundImage:`url(${bgImage})`,backgroundSize:"cover"}}>
    </div>
        <div className="signup-form">
          <div className="title">Signup</div>


        <form onSubmit={SubmitHandler} >
            <div className="input-boxes">
              <div className="input-box">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Enter your name" name='FullName' value={user.FullName} onChange={UserHandler} required/>
              </div>
              <div className="input-box">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="User Name" name='userName' value={user.userName} onChange={UserHandler} required/>
              </div>
              <div className="input-box">
                <i className="fas fa-envelope"></i>
                <input type="text" placeholder="Enter your email" name="email"  value={user.email} onChange={UserHandler} required/>
              </div>
              <div className="input-box">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Enter your password" name='password'  value={user.password} onChange={UserHandler} required/>
              </div>
              {/*<div className="input-box">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Enter your password" name='password'  value={user.password} onChange={UserHandler} required/>
              </div>*/ }
              <div className="button input-box">
                <input type="submit"/>
              </div>
              <div style={{display:"none"}} className="google-btn" onClick={googleSignIn}>
                <div className="google-icon-wrapper">
                  <img  crossOrigin="anonymous" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                </div>
                <p className="btn-text"><b>Register with Google</b></p>
              </div>

              <div style={{display:"none"}} className="apple-btn">
        
                <div className="apple-icon-wrapper">
                  <img crossOrigin="anonymous" className="apple-icon" src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"/>
                </div>
                <p className="btn-text"><b>Register with Apple</b></p>
              </div>
              <div className="text sign-up-text">Already have an account? <a href="/login">Login now</a></div>
            </div>
      </form>
    </div>
    </div>
    </div>
  </div>
</div>
)
}

export default Login