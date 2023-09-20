import React, { useContext, useEffect, useState } from 'react';
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { GlobalContext } from '../../../context/globalContext';
import { createOrder } from '../../../features/user/userSlice';
import uniqId from "uniqid";
import { useDispatch, useSelector } from 'react-redux';


const Stripe = ({total}) => {

  // CONTEXT API
  const globalContext = useContext(GlobalContext);
  const { setPayWithStripe, refToastCheckoutAutocomplete, refZipCode, billingInfo, setBillingInfo, setShowZipCodeModal, setSameAsShipping, sameAsShipping, setShowPayment, setShowShipping, refTop, shippingInfo, shippingMethod } = globalContext;

  const dispatch = useDispatch();
  const state = useSelector(state => state.user);
  const { user, cart } = state;

  const [userCart, setUserCart] = useState([]);


  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async() =>{

    if(!stripe || !elements){
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/checkout"
      },
      redirect: "if_required",
    });

    if(error){
      // Action
      refToastCheckoutAutocomplete.current.show({life: 3000, severity: "error", summary: "Ups!", detail: error.message});
    }else if(paymentIntent && paymentIntent.status === "succeeded"){
      dispatch(createOrder({
        belongsTo: user?.id,
        orderId: uniqId(),
        orderStatus: "Ordered",
        totalPrice: total,
        shippingAddress: `${shippingInfo.firstName} ${shippingInfo.lastName}. ${shippingInfo.street} ${shippingInfo.streetNumber} ${shippingInfo.apartment}. ${shippingInfo.country}, ${shippingInfo.city}. ${shippingInfo.state}, ${shippingInfo.zipCode}`,
        billingAddress: sameAsShipping ? `${shippingInfo.firstName} ${shippingInfo.lastName}. ${shippingInfo.street} ${shippingInfo.streetNumber} ${shippingInfo.apartment}. ${shippingInfo.country}, ${shippingInfo.city}. ${shippingInfo.state}, ${shippingInfo.zipCode}` : `${billingInfo.firstName} ${billingInfo.lastName}. ${billingInfo.street} ${billingInfo.streetNumber} ${billingInfo.apartment}. ${billingInfo.country}, ${billingInfo.city}. ${billingInfo.state}, ${billingInfo.zipCode}`,
        shippingMethod: shippingMethod,
        items: userCart
      }));
    }else{
      refToastCheckoutAutocomplete.current.show({life: 3000, severity: "error", summary: "Ups!", detail: "Payment failed"});
    }

    setIsProcessing(false);
  };

  useEffect(() => {
    if(!stripe){
      return;
    };

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if(clientSecret){
      stripe.retrievePaymentIntent(clientSecret)
      .then(({paymentIntent}) =>{
        console.log(paymentIntent.status);
      })
    }

  }, [stripe]);

  useEffect(() => {
    if(cart){
      if(typeof cart === "string"){
        return setUserCart(JSON.parse(cart));
      };
      if(cart){
        return setUserCart(cart);
      };
    }
  }, [cart]);
 
  useEffect(() => {
    console.log(userCart);
  }, [userCart]);


  const handleBack = () =>{
    setPayWithStripe(false);
  };

  return ( 
    <div className='w-100 px-5'>
      <PaymentElement/>
      <div className='d-flex w-100 justify-content-between align-items-center mt-5'>
          <div onClick={handleBack} style={{width: "20px", height: "20px"}} className='d-flex align-items-center'>
            <i className="fa-solid fa-caret-left fa-lg ps-2" style={{color: "#777777", cursor: "pointer"}}></i>
          </div>
          <button disabled={isProcessing} onClick={handlePay} className='stripeButton'>
            <span>
              {
                isProcessing ? "Processing..." : "Pay now"
              }
            </span>
          </button>
      </div>
    </div>
   );
}
 
export default Stripe;