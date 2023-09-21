import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/globalContext";
import LoginModalN from "./Modals/Login/Login.jsx";
import { useSelector } from "react-redux";
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css"; 

const Header = () => {
  const refToast = useRef();
  const globalContext = useContext(GlobalContext);
  const {setShowLoginModal } = globalContext;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenuMenOpen, setMenuMenOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const state = useSelector(state => state.user);
  const { user, cart } = state;


  const handleAccount = () =>{
    if(user && user?.id){
      navigate("/account")
    }else{
      return refToast.current.show({life: 3000, severity: "info", summary: 'Hi there!', detail: "Please login to view your account"});
    }
  };

  const handleLogin = () =>{
    if(user){
      return refToast.current.show({life: 3000, severity: "info", summary: `Hi ${user?.userName}`, detail: "You are already logged in"});
    }else{
      setShowLoginModal(true);
    }
  };

  const handleCheckout = () =>{
    if(!user){
      return refToast.current.show({life: 3000, severity: "info", summary: "We're sorry", detail: "Please login to view your cart"});
    }else if(!user.cart || !user.cart.length || !cart || !cart.length){
      return refToast.current.show({life: 3000, severity: "info", summary: "We're sorry", detail: "You don't have any items in your cart"});
    }else{
      navigate("/checkout");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevMenu) => {
      if (prevMenu) {
        setSubMenuOpen(false);
        setMenuMenOpen(false);

        document.body.style.overflow = "";
      } else {
        document.body.style.overflow = "hidden";
      }
      return !prevMenu;
    });
  };
  const toggleSubMenuOpen = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const toggleSubMenuMenOpen = () => {
    setMenuMenOpen(!subMenuMenOpen);
  };

  // Close the Menu Toggle in others views
  const handleNavigation = (path) => {
    document.body.style.overflow = "";
    navigate(path);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      setSubMenuOpen(false);
      setMenuMenOpen(false);
    }
  }, [isMenuOpen]);

  // Clouse menu whit click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !closeRef.current.contains(event.target)
      ) {
        document.body.style.overflow = "";
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="App-header">
      <LoginModalN/>
      <div style={{zIndex: "1204"}} className="position-relative">
        <Toast ref={refToast} position='top-left'></Toast>
      </div>
      <div className={isMenuOpen ? "overlay open" : "overlay"}></div>     
      <div ref={closeRef} onClick={toggleMenu} className="menu-toggle">
        {isMenuOpen ? "Close" : "Menu"}
        </div>     
      <div
        ref={menuRef}
        className={`toggleMenuHome ${isMenuOpen ? "open" : ""}`}>      
        {showLogin && (
          <>
            <div className="containerLogin">
              <h4 className="menuLogin" onClick={handleLogin}>
                Login
              </h4>
            </div>
          </>
        )}
        <div className="textMenu">
          <p className="nameToggleSub" onClick={toggleSubMenuOpen}>
            Women's Collections
          </p>
          <div className={`submenu ${subMenuOpen ? "open" : ""}`}>
            <p onClick={() => navigate("/collection/louisvuitton")}>Louis Vuitton</p>
            <p onClick={() => navigate("/collection/gucci")}>Gucci</p>
            <p onClick={() => navigate("/collection/jimmychoo")}>Jimmy Choo</p>
            <p onClick={() => navigate("/collection/dolce&gabbana")}>Dolce & Gabanna</p>
            <p onClick={() => navigate("/collection/fendi")}>Fendi</p>
          </div>
          
          <p className="back-header" onClick={() => navigate("/ourStore")}>Our Store</p>
          <p className="back-header" onClick={() => navigate("/")}>Back</p>
        </div>
      </div>        
      <div className="header d-flex w-100"> 
        <div className="d-flex align-items-center justify-content-center text-white">
          <div className="header-links">         
            <p className="me-5" onClick={() => handleNavigation("home")}>
              Home
            </p>
            <p className="me-5" onClick={handleAccount}>
              Account
            </p>
            <p onClick={handleCheckout}>Checkout</p>    
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;