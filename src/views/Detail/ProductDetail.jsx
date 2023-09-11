import React, { useState } from "react";
import { FaCcVisa, FaCcPaypal } from "react-icons/fa";
import { SiAmericanexpress } from "react-icons/si";
import { FaCcMastercard } from "react-icons/fa6";
import { FaGooglePay } from "react-icons/fa6";

const ProductDetail = ({ product }) => {
  const [isMenuDetailOpen, setMenuDetailOpen] = useState(false);
  const [isMaterialOpen, setMaterialOpen] = useState(false);
  const [isPaymentOptionsOpen, setPaymentOptionsOpen] = useState(false);

  const toggleMenu = () => {
    setMenuDetailOpen(!isMenuDetailOpen);
  };
  const toggleMaterial = () => {
    setMaterialOpen(!isMaterialOpen);
  };

  const togglePaymentOptions = () => {
    setPaymentOptionsOpen(!isPaymentOptionsOpen);
  };

  return (
    <div className={`detail-container ${isMenuDetailOpen ? "open" : ""}`}>
      <div className="image-section">
        {product.imageURLs.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${product.name}-${index}`}
            className="product-image"
          />
        ))}
      </div>
      <div className="info-section">
        <h1 className="nameDetail">{product.name}</h1>
        <div className="container-detail">
          <p className="priceDetail">{product.price}</p>
          <button className="btnDetail">Place in cart</button>

          <p>{product.description}</p>
          <ul className="specifications">
            {product.specifications.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
          <div className="colors">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="color-sample"
                style={{ backgroundColor: color }}
              ></span>
            ))}
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
                Please note that once your order is placed your credit card will
                be authorized for 0 GBP (CHF, AED, SAR or EUR for all other
                countries); this is for verification purposes only and will
                protect you from any risk of fraud. The authorized amount will
                be released by your credit card’s issuing bank according to its
                policy.
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
        </div>
      )}
    </div>
  );
};

export default ProductDetail;