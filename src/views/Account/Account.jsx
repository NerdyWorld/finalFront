import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./Account.module.css";
import AccountHeader from '../../components/AccountHeader/AccountHeader';
import { useInView } from 'react-intersection-observer';
import { GlobalContext } from '../../context/globalContext';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { contactPreference } from '../../features/user/userSlice';
import { TailSpin } from 'react-loader-spinner';
import { Translate } from 'react-auto-translate';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";


const Account = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector(state => state.user);
  const { user, message, userOrders } = state;

  const refToast = useRef();
  const handleLogout = () =>{
    setLogged(false);
    window.location.assign("http://localhost:3000/home")
  };

  // CONTEXT API
  const globalContext = useContext(GlobalContext);
  const { getPriceByCurrency, setLogged } = globalContext;

  const [fixSections, setFixSections] = useState(false);
  const [scrollTopLight, setScrollTopLight] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [userFavorites, setUserFavorites] = useState([]);

  const { ref: refHeader, inView, entry } = useInView({
    /* Optional options */
    threshold: 0.01,
  });

  const { ref: refFooter, inView: footerInView, entry: footerEntry } = useInView({
    /* Optional options */
    threshold: 0.2,
  });


  const { ref: refPoster, inView: posterInView, entry: posterEntry } = useInView({
    /* Optional options */
    threshold: 0.65,
  });

  useEffect(() => {
    if(user){
      if(typeof user.favorites === "string"){
        setUserFavorites(JSON.parse(user.favorites));
      }else if(!user.favorites){
        setUserFavorites([]);
      }else{
        setUserFavorites(user.favorites);
      }
    }
  }, [user]);

  useEffect(() => {
    if(inView){
      setFixSections(false);
    }else{
      setFixSections(true);
    }
  }, [inView]);

  useEffect(() => {
    if(footerInView){
      setScrollTopLight(true);
    }else{
      setScrollTopLight(false);
    }
  }, [footerInView]);

  useEffect(() => {
    if(posterInView){
      setShowScrollBtn(false);
    }else{
      setShowScrollBtn(true);
    }
  }, [posterInView]);

  return ( 
    <div className={styles.wrapper}>
      <AccountHeader refHeader={refHeader}/>
      <Toast ref={refToast} position='top-left'></Toast>
      <div className={`${styles.sections} ${fixSections && styles.fixed}`}>
        <div className={styles.logo}>
          <span>My</span>
          <h5>MIH</h5>
        </div>
        <div className={styles.section} style={{borderLeft:"1px solid #eae8e4"}} onClick={()=> navigate("/account")}>
          <span><Translate>Overview</Translate></span>
        </div>
        <div className={styles.section} onClick={()=> navigate("/account/profile")}>
          <span><Translate>My Profile</Translate></span>
        </div>
        <div className={styles.section} onClick={()=> navigate("/account/orders")}>
          <span><Translate>My Orders</Translate></span>
        </div>
        <div className={styles.section} style={{borderBottom:"2.5px solid #1f1f1f"}} onClick={()=> navigate("/account/wishlist")} >
          <span><Translate>My Wishlist</Translate></span>
        </div>
        <div className={styles.section} onClick={()=> refToast.current.show({life: 3000, severity: "info", summary: `Hi ${user?.userName}!`, detail: `Our robots are working in this functionality!`})}>
          <span><Translate>My Reviews</Translate></span>
        </div>
      </div>
      
      {/* SCROLL TO THE TOP BUTTON */}
      <div className={`${styles.scrollTop} ${showScrollBtn && styles.show}`}>
        <button className={scrollTopLight ? styles.light : ""} onClick={()=> window.scrollTo(0, 0)}>
        <Translate>Back to the start</Translate>
          <i className='bx bx-chevron-up'></i>
        </button>
      </div>

      <div className={styles.mainImg} style={{marginTop: fixSections ? "87.5px" : "0px"}} ref={refPoster}>
        <img src="/images/landing.png" alt="abc" />
      </div>
      <div className={styles.content}>
        <div className={styles.avatar}>
          <h3>{`${user?.firstName[0]}${user?.lastName[0]}`}</h3>
        </div>
        <div className={styles.contentContainer}>
          <p>{user?.firstName + " " + user?.lastName}</p>
          <div className={styles.cardsTop}>
            <div className={styles.eachCard}>
              <h5>My Profile</h5>
              <p className={styles.loginCredential}>Email • {user?.email}</p>
              <div className={styles.contactPreferences}>
                <p>Contact preferences</p>  
                <div className={styles.contactPreferencesContainer}>
                  <div className={styles.eachContact} onClick={()=> dispatch(contactPreference({userId: user?.id, contactPreference: "Email"}))}>
                    <div className={styles.contactIcon}>
                      <i className='bx bx-envelope bx-md'></i>
                      <div className={styles.contactStatus}>
                        {
                          message === `Updating preference Email` ? (
                            <TailSpin
                              height="17"
                              width="17"
                              color="#4fa94d"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          ):(
                            user?.contactPreferences.includes("Email") ? (
                              <i className="fa-solid fa-check" style={{color: "#5eb35e"}}></i>
                            ):(
                              <i className="fa-solid fa-xmark" style={{color: "#d84848"}}></i>
                            )
                          )
                        }
                      </div>
                    </div>
                    <span><Translate>Email newsletter</Translate></span>
                  </div>
                  <div className={styles.eachContact} onClick={()=> dispatch(contactPreference({userId: user?.id, contactPreference: "Phone"}))}>
                    <div className={styles.contactIcon}>
                      <i className='bx bx-mobile-alt bx-md'></i>
                      <div className={styles.contactStatus}>
                        {
                          message === `Updating preference Phone` ? (
                            <TailSpin
                              height="17"
                              width="17"
                              color="#4fa94d"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          ):(
                            user?.contactPreferences.includes("Phone") ? (
                              <i className="fa-solid fa-check" style={{color: "#5eb35e"}}></i>
                            ):(
                              <i className="fa-solid fa-xmark" style={{color: "#d84848"}}></i>
                            )
                          )
                        }
                      </div>
                    </div>
                    <span><Translate>Phone</Translate></span>
                  </div>
                  <div className={styles.eachContact} onClick={()=> dispatch(contactPreference({userId: user?.id, contactPreference: "Chat"}))}>
                    <div className={styles.contactIcon}>
                      <i className='bx bx-chat bx-md'></i>
                      <div className={styles.contactStatus}>
                        {
                          message === `Updating preference Chat` ? (
                            <TailSpin
                              height="17"
                              width="17"
                              color="#4fa94d"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          ):(
                            user?.contactPreferences.includes("Chat") ? (
                              <i className="fa-solid fa-check" style={{color: "#5eb35e"}}></i>
                            ):(
                              <i className="fa-solid fa-xmark" style={{color: "#d84848"}}></i>
                            )
                          )
                        }
                      </div>
                    </div>
                    <span><Translate>Chat</Translate></span>
                  </div>
                  <div className={styles.eachContact} onClick={()=> dispatch(contactPreference({userId: user?.id, contactPreference: "Mail"}))}>
                    <div className={styles.contactIcon}>
                      <i className='bx bx-mail-send bx-md'></i>
                      <div className={styles.contactStatus}>
                        {
                          message === `Updating preference Mail` ? (
                            <TailSpin
                              height="17"
                              width="17"
                              color="#4fa94d"
                              ariaLabel="tail-spin-loading"
                              radius="1"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                            />
                          ):(
                            user?.contactPreferences.includes("Mail") ? (
                              <i className="fa-solid fa-check" style={{color: "#5eb35e"}}></i>
                            ):(
                              <i className="fa-solid fa-xmark" style={{color: "#d84848"}}></i>
                            )
                          )
                        }
                      </div>
                    </div>
                    <span><Translate>Mail</Translate></span>
                  </div>
                </div>
              </div>
              <div className={styles.blackButton}>
                <button onClick={()=> navigate("/account/profile")}><Translate>Edit Profile</Translate></button>
              </div>
            </div>
            <div className={styles.eachCard}>
              <h5><Translate>My Orders</Translate></h5>
              <div className={styles.orders}>
                {
                  userOrders.length ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th><Translate>Status</Translate></th>
                          <th><Translate>Date</Translate></th>
                          <th><Translate>Items</Translate></th>
                          <th><Translate>Total</Translate></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          userOrders.map(el => {
                            return(
                              <tr>
                                <td>{el.orderId}</td>
                                <td>{el.orderStatus}</td>
                                <td>23/05/2023</td>
                                <td>{el.items.length}</td>
                                <td>${el.totalPrice}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  ):(
                    <span><Translate>There are no current orders</Translate></span>
                  )
                }
              </div>
              <div className={styles.blackButton}>
                <button onClick={()=> navigate("/account/orders")}><Translate>View Orders</Translate></button>               
                {/* <button>Start Shopping</button> */}
              </div>
            </div>
          </div>
          <div className={styles.cardsBottom}>
            <div className={styles.eachCard}>
                <h5><Translate>My Wishlist</Translate></h5>
                <div className={`${styles.wishlist} ${userFavorites.length > 0 && styles.active}`}>
                    {
                      userFavorites.length ? (
                        userFavorites.map((el, index) =>{
                          return(
                            <div className={styles.wishlistItem} key={index}>
                              <div className={styles.wItemImg}>
                                <img src={el.images[0].images[0]} alt="abc" />
                              </div>
                              <div className={styles.wItemDetails}>
                                <span>{el.name}</span>
                                <span>{getPriceByCurrency(el.price)}</span>
                              </div>
                            </div>
                          )
                        })
                      ):(
                        <span><Translate>There are no current items</Translate></span>
                      )
                    }
                </div>
                <div className={styles.blackButton}>
                  <button onClick={()=> navigate("/account/wishlist")}><Translate>Edit Wishlist</Translate></button>
                </div>
              </div>
              <div className={styles.eachCard}>

              </div>
          </div>
          <div className={styles.signOff}>
             <button onClick={handleLogout}>
             <Translate>Logout</Translate>
                <i className='bx bx-log-out'></i>
             </button>
          </div>
        </div>
      </div>
      <Footer refFooter={refFooter}/>
    </div>
   );
}
 
export default Account;