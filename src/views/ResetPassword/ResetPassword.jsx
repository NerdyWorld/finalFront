import React, { useEffect, useRef, useState } from 'react';
import styles from "./ResetPassword.module.css";
import Footer from '../../components/Footer/Footer';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { base_url } from '../../utils/utilities';
import jwt_decode from "jwt-decode";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 
import { updateUser } from '../../features/user/userSlice';


const ResetPassword = () => {
  
  const refToast = useRef();
  const navigate = useNavigate();
  const state = useSelector(state => state.user);
  const { message } = state;
  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if(message === "User updated"){
      refToast.current.show({life: 3000, severity: "success", summary: "Great!", detail: `Your password has been updated succesfully`});
      setTimeout(()=>{
        navigate("/account");
      },3100);
    }
  }, [message]);

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const resetPassword = async() =>{
    if(token){
      const decodeToken = jwt_decode(token);
      const validateUser = await axios.post(`${base_url}/user/get-users`, {userId: decodeToken.id});
      if(validateUser.data.msg === "User found"){
        dispatch(updateUser({userId: decodeToken.id, newUser: {password: password1}}));
      }else if(validateUser.data.msg === "User not found"){
        return refToast.current.show({life: 3000, severity: "error", summary: "Ups!", detail: `Invalid token`});
      }else{
        return refToast.current.show({life: 3000, severity: "error", summary: "We're sorry!", detail: `Something went wrong, please try again later`});
      }
    }
  };

  const handleGoBack = () =>{
    navigate("/home");
  };

  return ( 
    <div className={styles.wrapper}>
      <Toast ref={refToast} position='top-left'></Toast>
      <div className={styles.header}>
        <h5>Rivelle</h5>
        <span>Reset Password</span>
      </div>
      
      {/* GO BACK BUTTON */}
      <div className={styles.goBack} onClick={handleGoBack}>
        <div className={styles.svg}>
          <svg version="1.1" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                  <g fill="#19110B">
                      <polygon id="Fill-1" points="62.6420585 23 57.9060461 27.8669755 66.9114544 36.6308297 0 37.5436907 0.0921591929 44.3343681 67.1015934 43.4195669 58.225208 52.5423569 63.087333 57.2725487 80 39.8913249" transform="translate(40.000000, 40.136274) scale(-1, 1) translate(-40.000000, -40.136274) ">
                      </polygon>
                  </g>
              </g>
          </svg>
        </div>
      </div> 

      <div className={styles.container}>
        <h5>Reset Password</h5>
        <div className={styles.form}>
          <span>We noticed that you are experiencing difficulty accessing your account on Rivelle. Don't worry; we're here to help you regain access quickly and securely.</span>
          <span>Please enter the email address associated with your account. We will send you a link to reset your password.</span>
          <div className={styles.loginInput}>
            <div className='position-relative'>
              <input type={`${showPassword1 ? "text" : "password"}`} name='password1' onChange={(e)=> setPassword1(e.target.value)} value={password1}/>
              <div className={styles.seePassword}>
                {
                  showPassword1 ? <i className="fa-solid fa-eye" onClick={()=> setShowPassword1(!showPassword1)}></i> : <i className="fa-solid fa-eye-slash" onClick={()=> setShowPassword1(!showPassword1)}></i>
                }
              </div>
            </div>
          </div>
          <div className={styles.loginInput}>
            <div className='position-relative'>
              <input type={`${showPassword2 ? "text" : "password"}`} name='password2' onChange={(e)=> setPassword2(e.target.value)} value={password2}/>
              <div className={styles.seePassword}>
                {
                  showPassword2 ? <i className="fa-solid fa-eye" onClick={()=> setShowPassword2(!showPassword2)}></i> : <i className="fa-solid fa-eye-slash" onClick={()=> setShowPassword2(!showPassword2)}></i>
                }
              </div>
              <div className={styles.validEmail} style={{opacity: (password1 === password2 && password1.length > 0) ? "1" : "0"}}>
                <i className="fa-solid fa-check"></i>
              </div>
            </div>
          </div>
          <button onClick={resetPassword} className='d-flex align-items-center justify-content-center'>
            {
              (message === "Reseting password" || message === "Updating user") ? (
                <TailSpin
                  height="20"
                  width="20"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ):(
                "Reset Password"
              )
            }
          </button>
        </div>
      </div>

      <Footer/>
    </div>
   );
}
 
export default ResetPassword;