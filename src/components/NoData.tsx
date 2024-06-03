import React, { useState, useEffect } from "react";

interface NoDataProps {
    Title: string
    Subtext: string
    ImageLight: string
    ImageDark: string
}
const Modal: React.FC<NoDataProps>= ({
    Title,
    Subtext,
    ImageLight,
    ImageDark
}) => {
    return (
        <div className="section-placeholder">
            <div className="placeholder-content">
                <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img>
                <h3 className="dark-inverted">{Title}</h3>
                <p>{Subtext}</p>
            </div>
        </div>
    );
};



export default Modal;