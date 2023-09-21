import React, { useEffect, useRef, useState } from 'react';
import styles from "./ForgotPassword.module.css";
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { Translate } from 'react-auto-translate';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 
import { useDispatch, useSelector } from 'react-redux';
import { clearUserMessage, forgotPassword } from '../../features/user/userSlice';
import { TailSpin } from 'react-loader-spinner';


const ForgotPassword = () => {

  const refToast = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector(state => state.user);
  const { message } = state;

  const handleGoBack = () =>{
    navigate("/home");
  };

  const [email, setEmail] = useState("");

  const sendMail = () =>{
    if(email.length === 0){
      return refToast.current.show({life: 2000, severity: "success", summary: "Wait!", detail: `Please complete all fields to continue`});
    }else{
      dispatch(forgotPassword(email));
    }
  };

  useEffect(() => {
    if(message === "Forgot password email sent"){
      refToast.current.show({life: 3000, severity: "success", summary: "Great!", detail: `We sent your code to ${email}! Please check your inbox.`});
      setTimeout(()=>{
        dispatch(clearUserMessage());
      },3100);
    };
    if(message === "User not found"){
      refToast.current.show({life: 3000, severity: "warn", summary: "We're sorry!", detail: `We couldn't find any account associated with that email`});
    }
  }, [message]);

  return ( 
    <div className={styles.wrapper}>
      <Toast ref={refToast} position='top-left'></Toast>
      <div className={styles.header}>
        <h5>Rivelle</h5>
        <span>Forgot Password</span>
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
        <h5>Forgot Password</h5>
        <div className={styles.form}>
          <span>We noticed that you are experiencing difficulty accessing your account on Rivelle. Don't worry; we're here to help you regain access quickly and securely.</span>
          <span>Please enter the email address associated with your account. We will send you a link to reset your password.</span>
          <div className={styles.loginInput}>
            <div className='position-relative'>
              <input placeholder="example@example.com" type="text" name='email' onChange={(e)=> setEmail(e.target.value)} value={email}/>
            </div>
          </div>
          <button onClick={sendMail} className='d-flex align-items-center justify-content-center'>
            {
              message === "Sending forgot password" ? (
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
                "Send"
              )
            }
          </button>
        </div>
      </div>

      <Footer/>
    </div>
   );
}
 
export default ForgotPassword;