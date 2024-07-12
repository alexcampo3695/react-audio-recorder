import React, { useState, useEffect } from "react";
import { Glassfy, GlassfyOffering, GlassfyPermission, GlassfySku } from "capacitor-plugin-glassfy" ;
import InAppPayment from "../components/InAppPayment";
import { API_BASE_URL } from "../config";
import { useUser } from "../context/UserContext";

interface PaymentsProps {
    Title: string
    Subtitle: string
}


export const Payments: React.FC<PaymentsProps> = ({ Title, Subtitle }) => {
    const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);
    const { user } = useUser();
    const GLASSFY_API_KEY = import.meta.env.VITE_GLASSFY_API_KEY

    console.log('api_key:',GLASSFY_API_KEY)

    useEffect(() => {
        const initGlassfy = async () => {
          try {
            await Glassfy.initialize({ apiKey: 'fbe75b0835d54fd3ace820863c2c7855', watcherMode: false });
            const offerings = await Glassfy.offerings();
            console.log('offerings', offerings);
            setOfferings(offerings.all);
          } catch (e) {
            console.error("initialization error", e);
          }
        }
    
        initGlassfy();
      }, []);

      const handlePurchase = async (sku: GlassfySku) => {
        try {
            const transaction = await Glassfy.purchaseSku({ sku });
            const response = await fetch(`${API_BASE_URL}/api/payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user?.id,
                productId: sku.product.identifier,
                transactionId: transaction.productId,
                amount: sku.product.price,
              }),
            });
            console.log("Purchase Succesful", transaction);
        } catch (e) {
            console.error('Purchase Failed', e);
        }
      }

      return (
        
        <>
          {offerings.map((offering) => (
              <div>
                  <h2>{offering.offeringId}</h2>
                  {offering.skus.map((sku) => (
                      <>
                          <div className="tile-grid tile-grid-v2">
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
                            <div className="columns is-multiline">
                                <div className="title-wrap">
                                    <p>Looks like you're new here</p>
                                    <h2>Welcome to Huro. What would you like to do?</h2>
                                </div>
                                <div className="column is-4">
                                    <div 
                                      className="tile-grid-item"
                                      onClick = {() => handlePurchase(sku)}
                                    >
                                        <div className="tile-grid-item-inner">
                                            <img 
                                              style={{borderRadius: '10px'}}
                                              src="/src/styles/assets/drop.svg" data-demo-src="assets/img/icons/files/pdf.svg" alt=""></img>
                                            <div className="meta">
                                                <span className="dark-inverted">{sku.product.title}</span>
                                                  <span>
                                                    <span>${sku.product.price}</span>
                                                    <i aria-hidden="true" className="fas fa-circle icon-separator"></i>
                                                  <span>{sku.product.description}</span>
                                                </span>
                                            </div>
                                            <div className="dropdown is-spaced is-dots is-right dropdown-trigger">
                                                <div className="is-trigger" aria-haspopup="true">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      </>
                  ))}
              </div>
          ))}
        </>
      )
};

export default Payments;