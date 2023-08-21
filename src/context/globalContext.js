import { createContext, useEffect, useState } from "react";


export const GlobalContext = createContext();

export const GlobalProvider = ({children}) =>{

  const [logged, setLogged] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    localStorage.setItem("nerdyLanguage", language);
  }, [language]);


  // LOGIN PERSISTANCE
  useEffect(() => {
    if(logged){
      const getUserFromLocalStorage = localStorage.getItem("nerdyUser");
      if(!getUserFromLocalStorage){
        localStorage.setItem("nerdyUser", JSON.stringify(logged));
      };
    }else{
      const getUserFromLocalStorage = localStorage.getItem("nerdyUser");
      if(getUserFromLocalStorage){
        localStorage.removeItem("nerdyUser");
      };
    }
  }, [logged]);


  const data = {
    logged,
    setLogged,
    language,
    setLanguage
  };

  return <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
};