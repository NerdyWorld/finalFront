import React, { useEffect, useRef, useState } from "react";
import LoginModal from "../../components/Modals/LoginModal";
import LandingVuitton from "./CarouselLv";
import LandingJChoo from "./CarouselJChoo";
import LandingGucci from "./CarouselGucci";
import LandingDGabanna from "./CarouselDGab";
import LandingFendi from "./CarouselFendi";
import { useNavigate } from "react-router-dom";
import { BsChevronDoubleDown } from "react-icons/bs";
import { BsChevronDoubleUp } from "react-icons/bs"

const Home = () => {
  const navigate = useNavigate();
  const titleLanding = useRef(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contentLandingRef = useRef(null);
  const [currentCarousel, setCurrentCarousel] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isScrollingDown, setIsScrollingDown] = useState(true);
  const vuittonRef = useRef(null);
  const gucciRef = useRef(null);
  const chooRef = useRef(null);
  const dGabannaRef = useRef(null);
  const fendiRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const contentElement = contentLandingRef.current;

      if (titleLanding.current) {
        if (scrolled < 50) {
          titleLanding.current.style.fontSize = `${11 - scrolled / 5}rem`;
          titleLanding.current.style.transform = "translateX(0)";
          titleLanding.current.style.background = "#0e0e0e";
          titleLanding.current.style.color = "#fff";
          titleLanding.current.style.paddingTop = "120px";
          contentElement.style.marginTop = `${11 - scrolled / 5}rem`;
        } else if (scrolled >= 50 && scrolled < 150) {
          titleLanding.current.style.fontSize = "6rem";
          titleLanding.current.style.paddingTop = "30px";
          titleLanding.current.style.background = "#0e0e0e";
          titleLanding.current.style.transform = "translateX(0)";
          titleLanding.current.style.marginTop = "0";
          contentElement.style.marginTop = "3rem";
        } else {
          titleLanding.current.style.fontSize = "3rem";
          titleLanding.current.style.fontWeight = "400";
          titleLanding.current.style.boxShadow =
            "0 8px 10px -6px rgba(0, 0, 0, 1)";
          titleLanding.current.style.backdropFilter = "blur(5px)";
          titleLanding.current.style.marginTop = "0";
          titleLanding.current.style.padding = "2px";
          titleLanding.current.style.background = "rgba(255, 255, 255, 0.1)";
          titleLanding.current.style.color = "#fff";
          contentElement.style.marginTop = "3rem";
        }
      }
      if (scrolled > 50) {
        setShowLogin(false);
        setShowButton(true);
      } else {
        setShowLogin(true);
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const handleNextClick = () => {
    const carousels = [vuittonRef, gucciRef, chooRef, dGabannaRef, fendiRef];

    if (currentCarousel < carousels.length - 1) {
      carousels[currentCarousel + 1].current.scrollIntoView({ behavior: 'smooth' });
      setCurrentCarousel(prevCarousel => prevCarousel + 1);

      if (currentCarousel === carousels.length - 2) {       
        setIsScrollingDown(false);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentCarousel(0);
      setIsScrollingDown(true);
    }
};


  return (
    <div className="landing">
      <div className="navbar">
        <div className="titleLanding">
          <h1 ref={titleLanding} className="LandingWelc">
            Rivélle
          </h1>
          {showButton && (
    <div onClick={handleNextClick} className='scrollpage-home'>
       {isScrollingDown ? <BsChevronDoubleDown /> : <BsChevronDoubleUp />}
    </div>
)}
          {showLogin && (
            <div className="movingContainer">
              <div className="movingText">
                <h4 className="seeAllCollections">
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections </span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                  <span className="movingHome">See all our collections</span>
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="contentLanding" ref={contentLandingRef}>
      <div ref={vuittonRef}>
        <LandingVuitton
          buttonText="Explore the Louis Vuitton collection"
          brandName="Louis Vuitton"
          onButtonClick={() => navigate("/collection/louisvuitton")}
        />
        </div>
        <div ref={gucciRef}>
        <LandingGucci
          buttonText="Explore the Gucci collection"
          brandName="Gucci"
          onButtonClick={() => navigate("/collection/gucci")}
        />
        </div>
        <div ref={chooRef}>
        <LandingJChoo
          buttonText="Explore the Jimmy Choo collection"
          brandName="Jimmy Choo"
          onButtonClick={() => navigate("/collection/jimmychoo")}
        />
        </div>
        <div ref={dGabannaRef}>
        <LandingDGabanna
          buttonText="Explore the Dolce & Gabanna collection"
          brandName="Dolce & Gabbana"
          onButtonClick={() => navigate("/collection/dolce&gabbana")}
        />
        </div>
        <div ref={fendiRef}>
        <LandingFendi
          buttonText="Explore the Fendi collection"
          brandName="Fendi"
          onButtonClick={() => navigate("/collection/fendi")}
        />
        </div>
      </div>
    </div>
  );
};

export default Home;
