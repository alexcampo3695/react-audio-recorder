import React, { useState, useEffect } from "react";
import { Glassfy, GlassfyOffering, GlassfyPermission, GlassfySku } from "capacitor-plugin-glassfy" ;
import InAppPayment from "../components/InAppPayment";

interface PaymentsProps {
    Title: string
    Subtitle: string
}


export const Payments: React.FC<PaymentsProps> = ({ Title, Subtitle }) => {
    const [user, setUser] = useState<any | null>(null);
    const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);

    useEffect(() => {
        async function initGlassfy() {
          try {
            await Glassfy.initialize({ apiKey: "fbe75b0835d54fd3ace820863c2c7855", watcherMode: false });
            const offerings = await Glassfy.offerings();
            console.log('offerings', offerings);
            setOfferings(offerings.all);
          } catch (e) {
            console.error(e);
          }
        }
    
        initGlassfy();
      }, []);

      const handlePurchase = async (sku: GlassfySku) => {
        try {
            const transaction = await Glassfy.purchaseSku({ sku });
            console.log("Purchase Succesful", transaction);
        } catch (e) {
            console.error('Purchase Failed', e);
        }
      }

      return (
        <div>
            <h1>Available Subscriptions</h1>
            <div>
                {offerings.map((offering) => (
                    <div>
                        <h2>{offering.offeringId}</h2>
                        {offering.skus.map((sku) => (
                            <>
                                <h4>{sku.product.title}</h4>
                                <h4>{sku.product.description}</h4>
                                <h4>{sku.product.currencyCode}</h4>
                                <h4>{sku.product.price}</h4>
                                <a 
                                    className="button h-button is-primary"
                                    onClick={() => handlePurchase(sku)}
                                >
                                        Primary
                                </a>
                            </>
                            
                        ))}
                    </div>
                    
                ))}
            </div>
        </div>

      )

    
};

export default Payments;