import React, { useState, useEffect } from "react";

interface NoDataProps {
    Title: string
    Subtitle: string
    // Image: string
}
const NoData: React.FC<NoDataProps>= ({
    Title,
    Subtitle
}) => {
    return (
        <div className="section-placeholder">
            <div className="placeholder-content">
                <img className="light-image" src="assets/img/illustrations/placeholders/search-4.svg" alt=""></img>
                <img className="dark-image" src="assets/img/illustrations/placeholders/search-4-dark.svg" alt=""></img>
                <h3 className="dark-inverted">{Title}</h3>
                <p>{Subtitle}</p>
            </div>
        </div>
    );
};

export default NoData;