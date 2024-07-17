import React, { useState, useEffect } from "react";
import { Glassfy, GlassfyOffering, GlassfyPermission, GlassfySku } from "capacitor-plugin-glassfy" ;
import { API_BASE_URL } from "../config";
import { useUser } from "../context/UserContext";
import PageLoader from "../pages/LoaderPage";

interface PaymentsProps {
    Title: string
    Subtitle: string
}


export const Payments: React.FC = ({  }) => {
    const [offerings, setOfferings] = useState<GlassfyOffering[]>([]);
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const GLASSFY_API_KEY = import.meta.env.VITE_GLASSFY_API_KEY

    const userId = user?.id;

    console.log('api_key:',GLASSFY_API_KEY)

    useEffect(() => {
        const initGlassfy = async () => {
          try {
            setLoading(true);
            await Glassfy.initialize({ apiKey: 'fbe75b0835d54fd3ace820863c2c7855', watcherMode: false });
            const offerings = await Glassfy.offerings();
            console.log('offerings', offerings);
            setOfferings(offerings.all);
          } catch (e) {
            console.error("initialization error", e);
          } finally {
            setLoading(false);
          }
        }
    
        initGlassfy();
      }, []);

      const handlePurchase = async (sku: GlassfySku) => {
        try {
            const transaction = await Glassfy.purchaseSku({ sku });
            await Glassfy.connectCustomSubscriber({ subscriberId: userId || '' });
        } catch (e) {
            console.error('Purchase Failed', e);
        }
      }

      return (
        <>
          
          {loading ? (<PageLoader />) : (
            offerings.map((offering) => (
              <div>
                  <h2>{offering.offeringId}</h2>
                  {offering.skus.map((sku) => (
                      // <>
                      //     <div className="tile-grid tile-grid-v2">
                      //       <div className="page-placeholder custom-text-filter-placeholder is-hidden">
                      //           <div className="placeholder-content">
                      //               <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                      //               <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img>
                      //               <h3>We couldn't find any matching results.</h3>
                      //               <p className="is-larger">
                      //                   Too bad. Looks like we couldn't find any matching results for
                      //                   the search terms you've entered. Please try different search
                      //                   terms or criteria.
                      //               </p>
                      //           </div>
                      //       </div>
                      //       <div className="columns is-multiline">
                      //           <div className="column is-4">
                      //               <div 
                      //                 className="tile-grid-item"
                      //                 onClick = {() => handlePurchase(sku)}
                      //               >
                      //                   <div className="tile-grid-item-inner">
                      //                       {/* <img 
                      //                         style={{borderRadius: '10px'}}
                      //                         src="/src/styles/assets/drop.svg" data-demo-src="assets/img/icons/files/pdf.svg" alt="">
                      //                       </img> */}
                      //                       <div className="meta">
                      //                           <span className="dark-inverted">{sku.product.title}</span>
                      //                             <span>
                      //                               <span>${sku.product.price}</span>
                      //                               <i aria-hidden="true" className="fas fa-circle icon-separator"></i>
                      //                             <span>{sku.product.description}</span>
                      //                           </span>
                      //                       </div>
                      //                       <div className="dropdown is-spaced is-dots is-right dropdown-trigger">
                      //                           <div className="is-trigger" aria-haspopup="true">
                      //                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      //                           </div>
                      //                       </div>
                      //                   </div>
                      //               </div>
                      //           </div>
                      //       </div>
                      //   </div>
                      // </>

                      <div className="job-card">
                          <div className="job-card-header">
                              <img className="job-card-logo" src="assets/img/photo/demo/brands/airbnb.svg" data-demo-src="assets/img/photo/demo/brands/airbnb.svg" alt=""></img>
                          </div>
                          <div className="job-card-title">{sku.product.title} • {sku.product.price}</div>
                          <div className="job-card-subtitle">
                              {sku.product.description}
                          </div>
                          <div className="job-detail-buttons">
                              <div className="tags">
                                  <span className="tag is-solid is-curved">Unlimited Transcriptions</span>
                                  <span className="tag is-solid is-curved">AI</span>
                                  <span className="tag is-solid is-curved">Diagnosis Gen</span>
                                  <span className="tag is-solid is-curved">Medications Gen</span>
                                  <span className="tag is-solid is-curved">Tasks Gen</span>
                              </div>
                          </div>
                          <div className="job-card-buttons">
                              <div className="buttons">
                                  <button 
                                    className="button h-button is-primary is-raised"
                                    onClick = {() => handlePurchase(sku)}
                                  >
                                      Purchase
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          ))
          )}
        </>
      )
};

export default Payments;