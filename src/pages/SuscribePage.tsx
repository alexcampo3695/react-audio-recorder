import React from "react";
import ProfileSettings from "../components/ProfileSettings";
import AppWrapper from "./AppWrapper";
import SubscriptionOverview from "../react-native/SubscriptionOverview";

interface PatientDetailsProps {
  patientData: {
    FirstName: string;
    LastName: string;
    DateOfBirth: string;
  };
}

const SubscriptionsPage = () => {
  return (
    <AppWrapper
        children={<SubscriptionOverview />}
        title='Settings'
      />
  )
    
};

export default SubscriptionsPage;
