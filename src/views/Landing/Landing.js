import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Landing.module.css";

import { useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import Register from "./Register";
import { Dropdown } from 'primereact/dropdown';
import { GlobalContext } from "../../context/globalContext";

const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenuMenOpen, setMenuMenOpen] = useState(false);
  const menuRef = useRef(null);
  const closeRef = useRef(null);
  const globalContext = useContext(GlobalContext);
  const { currency, setCurrency } = globalContext;
  
  const toggleMenu = () => {
    setIsMenuOpen((prevMenu) => {
      if (prevMenu) {
        setSubMenuOpen(false);
        setMenuMenOpen(false);
        document.body.style.overflow = "";
      } else {
        document.body.style.overflow = "";
      }
      return !prevMenu;
    });
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



  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // OPACITY EFFECT
    setTimeout(()=>{
      setMounted(true)
    },100)
  }, []);


  const countrySelectItems = [
    {label: 'United States', value: 'USD'},
    {label: 'Cánada', value: 'CAD'},
    {label: 'Argentina', value: 'ARS'},
    {label: 'Australia', value: 'AUD'},
    {label: 'Europe', value: 'EUR'}
  ];

  const handleNavigate = () =>{
    if(currency){
      navigate("/home");
    }else{
      return;
    }
  }

  return (
    <div className="newLanding createAccount">  
      <div className="nav-landing">
       <p className="rvl-landing">Rivélle</p>     
        <p className="home-click" onClick={() => {
            document.body.style.overflow = "";  
            navigate("home")}}>Go to collections</p>
        </div>   
        <div className={styles.container}>
          <div className={styles.location} style={{marginLeft: mounted ? "0px" : "-200px", opacity: mounted ? 1 : 0}}>
            <span>Please select a location to continue</span>
            <div className={styles.dropDown} id='landing'>
              <Dropdown 
              className='landingDropdown'
              options={countrySelectItems} 
              onChange={(e) => setCurrency(e.value)} 
              placeholder={currency === "USD" ? "United States" : currency === "CAD" ? "Cánada" : currency === "EUR" ? "Europe" : currency === "ARS" ? "Argentina" : currency === "AUD" ? "Australia" : "Please choose a location"}/>
            </div>
          </div>
          <div className={styles.button}>
            <button onClick={handleNavigate} style={{backgroundColor: currency.length ? "#000000b1" : "transparent", color: currency.length ? "whitesmoke" : "#f5f5f5a1", border: currency.length ? "1px solid transparent" : "1px solid #f7f7f78c"}}>CONTINUE</button>
          </div>
        </div>  
      <div className={isMenuOpen ? "overlay open" : "overlay"}></div>  
      {/* <div ref={closeRef} onClick={toggleMenu} className="menu-toggle-landing">
        {isMenuOpen ? "Close" : "Login"} 
      </div>  */}
      <div
        ref={menuRef}
        className={`toggleMenuLanding ${isMenuOpen ? "open" : ""}`}>
         <h3 className="create-landing mb-5 text-uppercase">Sign up now</h3>
          <Register/>
          </div>         
    </div>
  );
};

export default Landing;
