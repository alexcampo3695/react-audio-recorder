import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import ProductService from "../helpers/ProductService";



const PaymentPage = () => {
  return (
    <AppWrapper
        children={
          <ProductService 
            Title="Wahtever" 
            Subtitle="Whatever"
          />
        }
        title='Settings'
      />
  )
    
};

export default PaymentPage;
