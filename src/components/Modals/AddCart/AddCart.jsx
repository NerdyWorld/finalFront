import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toggleCartItem } from "../../../features/user/userSlice";
import CartItemsList from "./CartList";

const CartButton = ({ product, close, open }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.user.cart);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [images, setImages] = useState([]);


  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest(".button-add-cart") || e.target.closest(".cart-items-list-modal")) {
        return; 
      }
      close(); 
    };
  
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [close]);


  const handleToggleItem = () => {
    if (user) {
      const data = {
        userId: user.id,
        item: {...product, images},
      };
      dispatch(toggleCartItem(data));
    } else {
      console.log("User not logged in");
    }
  };

  const isInCart = cartItems?.find((item) => item.id === product.id);

  const addToCartAndOpenModal = () => {
    if (!isInCart) {
      handleToggleItem();
    }
    setIsCartModalOpen(true);
  };

  let imageUrl = "";
  if (product.images && product.images.length) {
    const colorImageObj = product.images.find(
      (imgObj) => imgObj.color === product.selectedColor
    );
    if (colorImageObj) {
      imageUrl = colorImageObj.images[0];
    }
  }

  useEffect(() => {
    if(product){
      product.images.map(obj => {
        if(obj.color === product.selectedColor){
          setImages(obj.images);
        }
      })
    }
  }, [product]);

  return (
    <div className="button-add-cart" >
      <div className="cart-items-list-modal">
        <div className="btndetcart">
      <button className="button-modal-add" onClick={close}>X</button>
        </div>
        <div className="button-cart-container-title">
         
          <img src={imageUrl} alt="Producto" />
          <div className="data-cart-price">
            <span className="name-cart">{product.name}</span>
            <span className="price-cart">usd {product.price}</span>
          </div>
        </div>
        <div className="cart-item-details-add">
          <span className="color-cart-add">
            Color: {product.selectedColor || "No color available"}
          </span>

          {product.selectedSize !== "Default" && (
            <span>Size: {product.selectedSize}</span>
          )}

          <button className="add-to-cart" onClick={addToCartAndOpenModal}>
            {isInCart ? "Add to shopping bag" : "Add to shopping bag"}
          </button>
        </div>
      </div>
      {isCartModalOpen && (
        <CartItemsList
          className={isCartModalOpen ? "open" : ""}
          closeModal={() => setIsCartModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CartButton;