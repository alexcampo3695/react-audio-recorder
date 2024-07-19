import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import PurchaseTable from "../components/PurchaseHistory";



const PaymentPage = () => {
  return (
    <AppWrapper
        children={
          <PurchaseTable 
          />
        }
        title='Products'
      />
  )
};

export default PaymentPage;
