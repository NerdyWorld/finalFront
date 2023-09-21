import React from 'react'
import Header from './Header';
import { Outlet } from 'react-router-dom';
import FooterLayout from './Footer';


const Layout = () => {
  return (     
      <div>
        <Header />
       <Outlet />
       <FooterLayout />
      </div>
    
   );
}
 
export default Layout;