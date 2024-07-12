import React, { useState, useEffect } from "react";
import Payments from "../helpers/ProductService";
import { Glassfy, GlassfyOffering } from "capacitor-plugin-glassfy";


const InAppPayment: React.FC = ({}) => {
    return (
        <div className="standard-onboarding">
            <div className="title-wrap">
                <p>Looks like you're new here</p>
                <h2>Welcome to CareVoice. What would you like to do?</h2>
            </div>

            <div className="onboarding-wrap">
                <div className="onboarding-wrap-inner">
                    <div className="onboarding-card">
                        <img className="light-image" src="assets/img/illustrations/onboarding/set4-1.svg" alt=""></img>
                        <img className="dark-image" src="assets/img/illustrations/onboarding/set4-1-dark.svg" alt=""></img>
                        <h3>Monthly</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recte
                            dicis; Ita enim vivunt quidam, ut eorum vita refellatur
                            oratio. Sed tament.
                        </p>
                        <div className="button-wrap">
                            <a className="button h-button is-primary is-elevated">$99/Month</a>
                        </div>
                    </div>
                    <div className="onboarding-card">
                        <img className="light-image" src="assets/img/illustrations/onboarding/set4-1.svg" alt=""></img>
                        <img className="dark-image" src="assets/img/illustrations/onboarding/set4-1-dark.svg" alt=""></img>
                        <h3>Annual</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recte
                            dicis; Ita enim vivunt quidam, ut eorum vita refellatur
                            oratio. Sed tament.
                        </p>
                        <div className="button-wrap">
                            <a className="button h-button is-primary is-elevated">$899/Year</a>
                        </div>
                    </div>
                    <div className="onboarding-card">
                        <img className="light-image" src="assets/img/illustrations/onboarding/set4-1.svg" alt=""></img>
                        <img className="dark-image" src="assets/img/illustrations/onboarding/set4-1-dark.svg" alt=""></img>
                        <h3>Pay As You Go</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Recte
                            dicis; Ita enim vivunt quidam, ut eorum vita refellatur
                            oratio. Sed tament.
                        </p>
                        <div className="button-wrap">
                            <a className="button h-button is-primary is-elevated">$0.99/Transcription</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InAppPayment;