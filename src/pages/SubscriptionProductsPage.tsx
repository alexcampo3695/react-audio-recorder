import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import SubscriptionOverview from "../react-native/SubscriptionOverview";
import SubscriptionProducts from "../react-native/SubscriptionProducts";

interface PatientDetailsProps {
  patientData: {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
  };
}

const SubscriptionProductsPage = () => {
  return (
    <AppWrapper
        children={<SubscriptionProducts />}
        title='Settings'
      />
  )
    
};

export default SubscriptionProductsPage;
