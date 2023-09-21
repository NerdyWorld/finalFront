import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCcVisa, FaCcPaypal } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcMastercard } from "react-icons/fa6";
import { FaGooglePay } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../features/products/productSlice";
import CartButton from "../../components/Modals/AddCart/AddCart";
import { toggleCartItem } from "../../features/user/userSlice";
import { clearReviewMsg, createReview, getAllReviews } from "../../features/reviews/reviewsSlice";
import StarRating from "../../components/StarRating/StarRating";
import axios from "axios";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import { base_url } from "../../utils/utilities";
import { GlobalContext } from "../../context/globalContext";


const ProductDetail = ({ productId, initialSelectedColor }) => {
  const refToast = useRef();
  const [isMenuDetailOpen, setMenuDetailOpen] = useState(false);
  const [isMaterialOpen, setMaterialOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [isPaymentOptionsOpen, setPaymentOptionsOpen] = useState(false);
  const products = useSelector((state) => state.products.products);
  const product = products.find((product) => product.id === productId);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const [showCartButton, setShowCartButton] = useState(false); 
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(null);
  const globalContext = useContext(GlobalContext);
  const { getPriceByCurrency } = globalContext;
  // REVIEWS
  const reviews = useSelector((state) => state.reviews?.reviews?.data || []);
  const reviewsMessage = useSelector(state => state.reviews?.message);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [finalReviews, setFinalReviews] = useState([]);
  
  useEffect(() => {
    dispatch(getAllReviews());
  }, []);

  useEffect(() => {
    if(reviewsMessage === "Error creating the review"){
      return refToast.current.show({life: 2000, severity: "error", summary: "We're sorry!", detail: `Only one review per user is allowed per each product`});
    };
    if(reviewsMessage === "Review created"){
      refToast.current.show({life: 2000, severity: "success", summary: "Great!", detail: `Your review was created succesfully`});
      setIsReviewsOpen(false);
      setTimeout(()=>{
        dispatch(clearReviewMsg());
      },2100);
    };
  }, [reviewsMessage]);

  const handleReviewSubmit = () => {
    if (!reviewMessage || rating === 0) {
      return refToast.current.show({life: 2000, severity: "warn", summary: "Wait!", detail: `Please complete all fields to continue`});
    };
    const reviewData = {
      review: reviewMessage,
      rating,
      productId,
      userId: userState.user?.id,
      banned: false,
    };
    dispatch(createReview(reviewData));
  };

  useEffect(() => {
    if(reviews.length){
      console.log(reviews);
      const filteredReviews = reviews.filter(review => review.productId === productId);
  
      let array = [];
      if(filteredReviews.length){
        filteredReviews.map(async(el) => {
          const getUserData = await axios.post(`${base_url}/user/get-users`, {userId: el.userId});
          
          array.push({...el, avatar: getUserData.data.data.avatar, userName: getUserData.data.data.userName});
        })
      }
  
      setFinalReviews(array);
    }
  }, [reviews]);

  const toggleReviews = () => {
    setIsReviewsOpen(!isReviewsOpen);
  };
  
  // REVIEWS END

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProducts());
    }
  }, [dispatch, products]);


  useEffect(() => {
    if(product && userState.user){
      const findProduct = userState.cart.find(el => el.id === product.id);
      if(findProduct){
        setAlreadyInCart(true);
      }else{
        setAlreadyInCart(false);
      }
    }
  }, [product, userState]);

  const [selectedColor, setSelectedColor] = useState(
    initialSelectedColor ||
      (product && product.colors && product.colors.length > 0
        ? product.colors[0]
        : "")
  );
  const toggleMenu = () => {
    setMenuDetailOpen(!isMenuDetailOpen);
  };
  const toggleMaterial = () => {
    setMaterialOpen(!isMaterialOpen);
  };

  const togglePaymentOptions = () => {
    setPaymentOptionsOpen(!isPaymentOptionsOpen);
  };

  if (!product) {
    return <div>Loading...</div>;
  }
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const addToCart = () => {
    if (!selectedSize && !alreadyInCart) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    if (!userState.user || !userState.user.id) {
      return refToast.current.show({life: 2500, severity: "warn", summary: "We're sorry!", detail: `Please login to access this functionality`});
    };
    
    if(!alreadyInCart){
      setShowCartButton(true);
      setIsCartModalOpen(true); 
    };
    if(alreadyInCart){
      dispatch(toggleCartItem({userId: userState.user.id, item: product}));
    }
  };


  return (
    <div className={`detail-container ${isMenuDetailOpen ? "open" : ""}`}>
      <div style={{zIndex:"99999"}}>
        <Toast ref={refToast} position='top-left'></Toast>
      </div>
      {product && product.images && product.images.length > 0 && (
        <div className="image-section">
          {product.images.map((colorImages) => {
            if (colorImages.color === selectedColor) {
              return colorImages.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${product.name}-${index}`}
                  className="product-image"
                />
              ));
            }
            return null;
          })}          
        </div>
      )}     
      
      <div className="info-section">
        <h2 className="brandDetail">{product.brand}</h2>
        <p className="nameDetail">
          {product.name} - {product.categories}
        </p>
        <div className="container-detail">
          <p className="priceDetail">{getPriceByCurrency(product.price)}</p>
          {product && product.colors && product.colors.length > 0 && (
            <div className="colors-detail">
              {product.colors.map((color, index) => (
                <span
                  key={index}
                  className={`color-sample-dt ${
                    color === selectedColor ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                ></span>
              ))}
            </div>
          )}
          <div className="size-selection">
            <label htmlFor="size"></label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setSizeError(false);
              }}
              className={sizeError ? "error" : ""}
            >
              <option value="">Select size.</option>
              {product.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {sizeError && (
              <p className="size-error-message">Please select a size.</p>
            )}
          </div>

          <button onClick={addToCart} className="btnDetail">
            {
              alreadyInCart ? "Remove from cart" : "Place in cart"
            }
            <svg className="cartIcon" viewBox="0 0 576 512">
              <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
            </svg>
          </button>
            </div>
          <div className="container-detail-product">
            <p className="title-pdetail">Product Details</p>
            <p className="description-detail">{product.description}</p>
            <div className="specifications">
              {product.specifications.split("@").map((el, index) => {
                if (index > 0) {
                  return <li key={index}>{el}</li>;
                }
              })}
            </div>  

          <p className="prod-detail" onClick={toggleMenu}>
            More Info
          </p>     
           </div>
      
      </div>
      {isMenuDetailOpen && (
        <div className="detail-menu">
          <div className="close-det">
            <button className="bntclose" onClick={toggleMenu}>
              X
            </button>
          </div>
          <div className="section-toggle" onClick={toggleMaterial}>
            <h4 className="subtitle-detail">MATERIALS AND CARE</h4>
            <span className="toggle-icon">{isMaterialOpen ? "-" : "+"}</span>
          </div>
          {isMaterialOpen && (
            <ul>
              <li>
                Protect the product from direct exposure to light, heat, and
                rain.
              </li>
              <li>If it gets wet, dry it immediately with a soft cloth.</li>
              <li>
                Stuff the handbag with tissue paper to maintain its shape and
                absorb moisture, and store it in the provided flannel bag.
              </li>
              <li>Avoid carrying heavy items that might deform the bag.</li>
              <li>Clean the product with a soft, dry cloth.</li>
            </ul>
          )}
          <div className="section-toggle" onClick={togglePaymentOptions}>
            <h4 className="subtitle-detail">PAYMENT OPTIONS</h4>
            <span className="toggle-icon">
              {isPaymentOptionsOpen ? "-" : "+"}
            </span>
          </div>
          {isPaymentOptionsOpen && (
            <div>
              <div className="payment-icons">
                <div className="payment-icon">
                  <FaCcVisa size={32} />
                  <span className="card-det">Visa</span>
                </div>
                <div className="payment-icon">
                  <FaCcMastercard size={32} />
                  <span className="card-det">MasterCard</span>
                </div>
                <div className="payment-icon">
                  <SiAmericanexpress size={32} />
                  <span className="card-det">American Express</span>
                </div>
                <div className="payment-icon">
                  <FaCcPaypal size={32} />
                  <span className="card-det">Paypal</span>
                </div>
                <div className="payment-icon">
                  <FaGooglePay size={32} />
                  <span className="card-det">Google Pay</span>
                </div>
              </div>
              <div className="ul-det">
                <ul>
                  *excluding Kuwait, Qatar and Saudi Arabia. For credit card
                  payments, please note that your billing address must match the
                  address on your credit card statement.
                </ul>
                <ul>
                  Please note that once your order is placed your credit card
                  will be authorized for 0 GBP (CHF, AED, SAR or EUR for all
                  other countries); this is for verification purposes only and
                  will protect you from any risk of fraud. The authorized amount
                  will be released by your credit card’s issuing bank according
                  to its policy.
                </ul>
                <ul>
                  Save as otherwise stated on the website during the purchase
                  process, the purchase transaction will only be charged to your
                  credit card after we have verified your card details, received
                  credit authorization for an amount equal to the purchase price
                  of the ordered products, confirmed product availability and
                  prepared your order for shipping.
                </ul>
              </div>
            </div>
          )}

          <div className="section-toggle" onClick={toggleReviews}>
            <h4 className="subtitle-detail">REVIEWS</h4>
            <span className="toggle-icon">{isReviewsOpen ? "-" : "+"}</span>
          </div>
          {/* REVIEWS */}
          {isReviewsOpen && (
              <div>
                <div className="review-container">
                  <div className="review-dat-ppal">
                    <img
                      className="avatar-review"
                      src={userState.user?.avatar}
                      alt="User profile"
                    />
                    <div className="rating-review">
                      <p className="info-review">
                        {userState.user?.userName} {userState.user?.lastName}
                      </p>
                      <StarRating rating={rating} onRatingChange={setRating} />
                    </div>
                  </div>
                  <textarea
                  className="text-tarea"
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    placeholder="Leave your review..."
                  />
                  <button className='button-review' onClick={handleReviewSubmit}>Submit Review</button>
                </div>

                <div className="reviews-list">
                  {finalReviews.length > 0 ? (
                    finalReviews.map((review, index) => (
                      <div className="container-post-reviews" key={index}>                    
                          <div className="user-name-rev">                         
                            <img src={review.avatar} alt="abc"/>
                            <span>{review.userName}</span>
                          </div>                   
                        <p className="message-review">{review.review}</p>
                        <div className='rating'>
                        <StarRating  rating={review.rating} onRatingChange={null} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              </div>
          )}
          {/* REVIEWS END */}
        </div>
      )}
      

      {isCartModalOpen  && (
        <CartButton 
          product={{ ...product, selectedSize, selectedColor }} 
          close={() => setIsCartModalOpen(false)}
          open={() => setIsCartModalOpen(true)} 
        />
        )}
    </div>
  );
};

export default ProductDetail;