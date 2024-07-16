import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import ProductService, { Payments } from "../components/ProductService";



const PaymentPage = () => {
  return (
    <AppWrapper
        children={
          <Payments 
          />
        }
        title='Products'
      />
  )
};

export default PaymentPage;
