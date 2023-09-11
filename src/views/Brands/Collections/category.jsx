import React from "react";
import CategoryCarousel from "./categoryCarousel";
import CardCarousel from "./cardCarousel";


const Category = ({ brandName, title, subTitle, name, carousel1, carousel2, cardCategories }) => {
  return (
    <div className="category-section">
      <div className="container-carousel-view">       
        <CategoryCarousel images={carousel1} />       
        <CategoryCarousel images={carousel2} />
        <div className="carousel-overlay-title">
          <h2>{title}</h2>
          <p>{subTitle}</p>
        </div>       
      </div>
      <div className="card-category">
      {/* <CardCarousel categories={cardCategories} /> */}
      </div>
    </div>
  );
};

export default Category;

