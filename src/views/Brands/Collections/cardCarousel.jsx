import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { GlobalContext } from "../../../context/globalContext";

const CardCarousel = ({ products = [] }) => {
  const [selectedColors, setSelectedColors] = useState({});
  const navigate = useNavigate();
  const globalContext = useContext(GlobalContext);
  const { getPriceByCurrency } = globalContext;

  function handleColorChange(productId, selectedColor) {
    setSelectedColors((prev) => ({ ...prev, [productId]: selectedColor }));
  }

  return (
    <div className="card-carousel-container">
      {products.map((product) => {
        const activeColor = selectedColors[product.id] || product.colors[0];
        const activeImages = product.images.find(imgObj => imgObj.color === activeColor)?.images || [];
        return (
          <div key={product.id} className="card-view">
            <div            
              id={`carousel${product.id}`}
              className="card-carousel carousel slide"
              data-bs-ride="carousel"
            >
              <div className="card-carousel-inner carousel-inner">
                {activeImages.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`card-collection-carousel-item carousel-item ${imageIndex === 0 ? "active" : ""} ${product.brand === "Dolce & Gabbana" && "dolceCard"}`}
                  >
                    <div className="background-card">
                      {
                        image.includes("mp4") ? (
                          <video src={image.trim()} muted controls loop className='d-block w-100' onClick={()=> window.location.assign(`http://localhost:3000/products/${product.id}/${product.colors[0]}`)}></video>
                        ):(
                          image.replaceAll(" ", "").slice(0, 2) === "hh" ? <img src={"h" + image.slice(2, image.length).replaceAll(" ", "")} class="d-block w-100" alt="..."  onClick={()=> window.location.assign(`http://localhost:3000/products/${product.id}/${product.colors[0]}`)}/> : <img src={image.replaceAll(" ", "")} class="d-block w-100" alt="..."  onClick={()=> window.location.assign(`http://localhost:3000/products/${product.id}/${product.colors[0]}`)}/>
                        )
                      }
                    </div>
                  </div>
                ))}
              </div>
              <div className="color-options">
                <h4 className='name-card-collection'>{product.name}</h4>
                </div> 
                <div className='color-card'>                
                 <div className="colors-container">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(product.id, color)}
                    ></button>
                  ))}                   
                  </div>
                  <h4 className='price-card-collection'>{getPriceByCurrency(product.price)}</h4>
                    {/* <BsCartPlus style={{width:"30px", color:"white", marginRight:"20px"}}/> */}
                </div>       

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel${product.id}`}
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon custom-icon-card"
                  aria-hidden="true"
                  style={{ filter: "invert(70%)", backgroundSize: "50%" }}
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel${product.id}`}
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon custom-icon-card"
                  aria-hidden="true"
                  style={{ filter: "invert(70%)", backgroundSize: "50%" }}
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardCarousel;
