import React, { useContext } from 'react';
import styles from "./Footer.module.css";
import { GlobalContext } from '../../context/globalContext';

const Footer = ({refFooter, dark}) => {

  // CONTEXT API
  const globalContext = useContext(GlobalContext);
  const { setLanguage, language, setCurrency, currency, setShowCurrencyDropdown, showCurrencyDropdown } = globalContext;

  return ( 
    <div className={styles.footer} ref={refFooter} style={{backgroundColor: dark ? "black" : "#19110b"}}>
          {
            dark ? (
              <div className={styles.divy}>
                <div className={styles.darkDiv}>
                  <h5>RIVELLE</h5>
                  <div className={styles.currency}>
                    <div className={styles.currentCurrency} onClick={()=> setShowCurrencyDropdown(!showCurrencyDropdown)}>
                      <div className='d-flex align-items-start justify-content-start w-100'>
                        <span className={styles.currencySpan}>{currency}</span>
                      </div>
                      <div className={styles.currencyToggle}>
                        <i className='bx bx-chevron-right bx-xs' style={{transform: showCurrencyDropdown ? "scaleY(-1) rotate(90deg)" : "scaleY(-1) rotate(-90deg)", marginTop: showCurrencyDropdown ? "-1px" : "-4px"}}></i>
                      </div>
                    </div>
                    <div className={styles.currencyDropdown} style={{opacity: showCurrencyDropdown ? "1" : "0", visibility: showCurrencyDropdown ? "visible" : "hidden"}}>
                      <ul>
                        <li onClick={()=> setCurrency("USD")}>USD</li>
                        <li onClick={()=> setCurrency("EUR")}>EUR</li>
                        <li onClick={()=> setCurrency("CAD")}>CAD</li>
                        <li onClick={()=> setCurrency("AUD")}>AUD</li>
                        <li onClick={()=> setCurrency("ARS")}>ARS</li>
                      </ul>
                    </div>
                  </div> 
                </div>
                <div className='mt-4 d-flex align-items-center gap-5'>
                  <a href="mailto:rivellecompany@gmail.com">rivellecompany@gmail.com</a>
                  <a href="tel:+1786300300">+1786300300</a>
                </div>
              </div>
            ):(
              <div>
                <h5>RIVELLE</h5>
                <div className={styles.languageContainer}>
                  <div className={styles.world}>
                    <i className='bx bx-world'></i>
                  </div>
                  <div className={styles.languages}>
                    <div onClick={()=> setLanguage("en")} className={styles.language} style={{borderLeft: "1px solid white", paddingLeft: "0.8rem"}}>
                      <span className={language === "en" && styles.chosenLanguage}>EN</span>
                    </div>
                    <div onClick={()=> setLanguage("es")} className={styles.language}>
                      <span className={language === "es" && styles.chosenLanguage}>ES</span>
                    </div>
                    <div onClick={()=> setLanguage("fr")} className={styles.language}>
                      <span className={language === "fr" && styles.chosenLanguage}>FR</span>
                    </div>
                    <div onClick={()=> setLanguage("it")} className={styles.language}>
                      <span className={language === "it" && styles.chosenLanguage}>IT</span>
                    </div>
                    <div onClick={()=> setLanguage("de")} className={styles.language}>
                      <span className={language === "de" && styles.chosenLanguage}>DE</span>
                    </div>
                    <div onClick={()=> setLanguage("pt")} className={styles.language}>
                      <span className={language === "pt" && styles.chosenLanguage}>PT</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
      </div>
   );
}
 
export default Footer;