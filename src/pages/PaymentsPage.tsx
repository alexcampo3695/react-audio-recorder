import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import ProductService, { Payments } from "../helpers/ProductService";



const PaymentPage = () => {
  return (
    <AppWrapper
        children={
          <Payments 
            Title="Wahtever" 
            Subtitle="Whatever"
          />
        }
        title='Products'
      />
  )
};

export default PaymentPage;
