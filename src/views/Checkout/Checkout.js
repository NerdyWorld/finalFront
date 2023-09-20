import React, { useContext, useEffect, useState } from 'react';
import styles from "./Checkout.module.css";
import { useNavigate } from "react-router-dom";
import{ loadStripe } from "@stripe/stripe-js";
import { STRIPE_P_KEY } from '../../utils/utilities';
import axios from "axios";
import { Elements } from '@stripe/react-stripe-js';
import Stripe from '../../components/Checkout/PayWithStripe/PayWithStripe';
import Payment from '../../components/Checkout/Payment/PaymentSection';
import { GlobalContext } from '../../context/globalContext';
import Information from '../../components/Checkout/Information/InfoSection';
import Shipping from '../../components/Checkout/Shipping/ShippingSection';
import ZipCode from '../../components/Modals/Checkout/ZipCode/zipCode';
import CheckoutModal from '../../components/Modals/Checkout/Products/Product';
import { Helmet } from 'react-helmet';
import CheckoutBreadcrumb from '../../components/Utils/CheckoutBreadcrumb/CheckoutBreadcrumb';
import ZoomProduct from '../../components/Modals/Checkout/Products/ZoomProduct';
import { useDispatch, useSelector } from 'react-redux';
import { emptyCart } from '../../features/user/userSlice';

const stripePromise = loadStripe(STRIPE_P_KEY);


const Checkout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Checkout Grid
  const [showInList, setShowInList] = useState(false);


  // CONTEXT API
  const globalContext = useContext(GlobalContext);
  const { 
    payWithStripe,
    showInfo,
    showShipping,
    showPayment,
    setShowProductModal,
    setShowZoomProduct,
    getPriceByCurrency,
    refToastCheckoutAutocomplete
  } = globalContext;



  const state = useSelector(state => state.user);
  const { user, cart, message } = state;

  const [userCart, setUserCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if(user){
      if(typeof cart === "string"){
        return setUserCart(JSON.parse(cart));
      };
      if(cart.length){
        return setUserCart(cart);
      };
      if(!cart){
        return setUserCart([]);
      }
    }
  }, [cart, user]);

  useEffect(() => {
    if(userCart.length){
      let price = 0;
      userCart.map(el =>{
        price += el.price;
      });

      setTotal(price);
    }
  }, [userCart]);

  // STRIPE IMPLEMENTATION
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // STRIPE PAYMENT IMPLEMENTATION
    if(total > 0){
      (async()=>{
        const getClientSecret = await axios.post("http://localhost:3001/api/stripe/create-payment-intent", {
          data: {
            currency: "usd",
            amount: total
          }
        });
    
        setClientSecret(getClientSecret.data.clientSecret);
      })()
    }
  }, [total]);
  // ------- STRIPE ENDS ----------->

  useEffect(() => {
    if(message === "Order created"){
      dispatch(emptyCart(user?.id))
      refToastCheckoutAutocomplete.current.show({life: 2000, severity: "success", summary: "Thank you!", detail: "We received your order succesfully!"});
      setTimeout(()=>{
        navigate("/account/orders");
      },2100);
    };
  }, [message]);

  


  return ( 
    <div className={`checkout ${styles.wrapper}`}>
    <Helmet title='Checkout'/>

      {/* ------ MODALS ----> */}
        <ZipCode/>
        <CheckoutModal/>
        <ZoomProduct/>
      {/* ------------- */}
        <div className={styles.goBack} onClick={()=> navigate("/home")}>
          <i className="fa-solid fa-angle-left"></i>
        </div>
        <div className={styles.left}>
            <div className={styles.leftWelcome}>
                <i className="fa-solid fa-lock fa-xs"></i>
                <span>
                  Your information is secured
                </span>
            </div>
            {/* <div className={styles.leftWe}>
              <i className="fa-solid fa-bag-shopping fa-xl" style={{color: "whitesmoke"}}></i>
              <h3>Rivelle</h3>
            </div> */}
            <div className={styles.totalContainer}>
              <div className={styles.leftTotal}>
                <span>{getPriceByCurrency(total)}</span>
                <div className={styles.leftSubTotal}>
                  <span>In</span>
                  <span>Total</span>
                </div>
              </div>
              <div className={styles.grid}>
                <div className={`grid-div ${!showInList && "active"}`}>
                  <i className={`fa-solid fa-grip`} onClick={()=> setShowInList(!showInList)}></i>
                </div>
                <div className={`grid-div ${showInList && "active"}`}>
                  <i className={`fa-solid fa-grip-vertical`} onClick={()=> setShowInList(!showInList)}></i>
                </div>
              </div>
            </div>
          <div className={styles.leftItems}>
            {/* ITEMS */}

            {
              showInList ? (
                userCart.map((el, index) => {
                  return(
                    <div key={index} className={styles.leftEachImgList}>
                      <div className={styles.leftEachImgListSub}>
                        <div className={styles.leftEachImg} onClick={()=> setShowZoomProduct(el.images)}>
                          <img src={el.images[0]} alt="abc"/>
                        </div>
                        <div className={styles.leftEachImgListSub2}>
                          <span>{el.name}</span>
                          <span>{el.brand}</span>
                        </div>
                      </div>
                      <div className={styles.leftEachImgListSub3}>
                        <span>{getPriceByCurrency(el.price)}</span>
                      </div>
                    </div>
                  )
                })
              ):(
                userCart.map(el => {
                  return(
                    <div className={styles.leftEachImg}>
                      <img src={el.images[0]} alt="abc"/>
                      <div onClick={()=> setShowProductModal(el)}>
                        <i className="fa-solid fa-eye fa-xl"></i>
                      </div>
                    </div>
                  )
                })
              )
            }
            
            
          </div>
          <div className={styles.leftFooter}>
            <span>Powered by Rivélle</span>
            <span>Shopping Policy</span>
          </div>
        </div>

        <div className={styles.right}>
          {
            // THESE ARE THE STEPS
            ((showInfo || showShipping || showPayment) && !payWithStripe) &&
            <CheckoutBreadcrumb/>
          }
          {
            showInfo && !payWithStripe &&
            <Information/>
          }
          {
            showShipping && !payWithStripe &&
            <Shipping/>
          }
          {
            showPayment && !payWithStripe && 
            <Payment total={total}/>
          }



          {
            payWithStripe && stripePromise && clientSecret &&
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <div className={styles.stripeDiv}>
                <div>
                  <img src="/images/stripeLogo.svg" alt="abc" width={100}/>
                </div>
                <Stripe total={total}/>
              </div>
            </Elements>
          }
        </div>
    </div>
   );
}
 
export default Checkout;