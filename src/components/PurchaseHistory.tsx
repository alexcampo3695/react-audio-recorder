import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import { useHistory } from "react-router-dom";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";
import { useUser } from "../context/UserContext";
import FlexTable from "./FlexTable";
import "../styles/flex-list.css";
import { handle } from "mdast-util-to-markdown/lib/handle";
import NoData from "./NoData";
import { API_BASE_URL } from "../config";

interface Payment {
  userId: string;
  subscriberId: string;
  productId: string;
  original_transaction_id: string;
  purchaseDate: Date;
  price: number;
  priceUsd: number;
  currency_code: string;
  country_code: string;
  store: string;
  environment: string;
  isSubscriptionActive: boolean;
  expireDate: Date;
  eventType: number;
  eventId: string;
  eventDate: Date;
  source: string;
  vendorId: string;
  appId: string;
  customId?: string;
  device?: string;
  systemVersion?: string;
  receiptValidated: boolean;
  appleReceiptValidated: boolean;
  glassfyValidated: boolean;
}
  
interface FlexItemProps {
    UserId: string;
    ProductId: string;
    DatePurchased: Date;
    Price: number;
    IsSubscriptionActive: boolean;
}

const PurchaseHistoryItem: React.FC<FlexItemProps> = ({ UserId, ProductId, DatePurchased, Price, IsSubscriptionActive  }) => {

    const cleanProductName = (productName: string) => {
      switch (productName) {
        case 'care_voice_subscription_monthly_99.99':
          return 'Monthly Subscription';
        case 'care_voice_subscription_annual_899.99':
          return 'Yearly Subscription';
        default:
          return productName;
      }
    }

    return (
        <div className="flex-table-item flex-table-item-animation">
            <div className="flex-table-cell" data-th="Product">
              <span className="light-text" data-filter-match="">{cleanProductName(ProductId)}</span>
            </div>
            <div className="flex-table-cell" data-th="Purchase Date">
                <span className="light-text" data-filter-match="">{formatDate(DatePurchased.toString())}</span>
            </div>
            <div className="flex-table-cell" data-th="Price">
                <span className="light-text" data-filter-match="">{'$'}{Price.toString()}</span>
            </div>
            <div className="flex-table-cell cell-end" data-th="Status">
              {IsSubscriptionActive === true 
                ?   <span className="tag is-rounded is-success is-elevated">Active</span> 
                :   <span className="tag is-rounded is-danger is-elevated">Deavtice</span> 
              }
            </div>
        </div>
    )
};



const PurchaseTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPayments = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    console.log('api base url:', API_BASE_URL);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/${user.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch purchases: ${response.status}`);
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPayments();
    }
  }, [user?.id]);

  console.log('Payments:', payments);

  return (
    <div className="flex-list-wrapper flex-list-v1">
      <div className="page-placeholder custom-text-filter-placeholder is-hidden">
          <div className="placeholder-content">
              <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
              <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img>
              <h3>We couldn't find any matching results.</h3>
              <p className="is-larger">
                  Too bad. Looks like we couldn't find any matching results for
                  the search terms you've entered. Please try different search
                  terms or criteria.
              </p>
          </div>
      </div>

      <div className="flex-table">
          <div className="flex-table-header" data-filter-hide="">
              <span >Product</span>
              <span>Purchase Date</span>
              <span>Price</span>
              <span className="cell-end">Status</span>
          </div>

          <div className="flex-list-inner">   
            {payments.length > 0 ? (
              payments.map((payment: Payment) => (
                <PurchaseHistoryItem
                  key={payment.eventId} // Assuming eventId is unique
                  UserId={payment.userId}
                  ProductId={payment.productId}
                  DatePurchased={payment.purchaseDate}
                  Price={payment.price}
                  IsSubscriptionActive={payment.isSubscriptionActive}
                />
              ))
            ) : (
              <div className="placeholder-content">
                {/* <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img> */}
                {/* <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img> */}
                <h3>We couldn't find any purchase.</h3>
                <p className="is-larger">
                    Too bad. Looks like we couldn't find any purchases for your account.
                </p>
              </div>
            )}
          </div>
      </div>
  </div>
  );
};

export default PurchaseTable;
