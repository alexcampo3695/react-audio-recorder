import React, { useState, useEffect, ReactElement } from "react";

interface ModalProps {
    ModalTitle: string;
    Type: 'image' | 'custom';
    Header?: string;
    Subtext?: string;
    Image?: string;
    hasButtons: boolean;
    PrimaryButtonText?: string;
    SecondaryButtonText?: string;
    Children?: ReactElement
    IsLarge: boolean;
    onSubmit?: () => void;
    onClose: () => void;
}
const Modal: React.FC<ModalProps>= ({
    ModalTitle,
    Type,
    Header,
    Subtext,
    hasButtons,
    PrimaryButtonText,
    SecondaryButtonText,
    Children,
    IsLarge,
    onSubmit,
    onClose
}) => {
    return (
        <div id="demo-modal" className={`modal h-modal is-active ${IsLarge ? 'is-big' : ''}`}>
            <div className="modal-background  h-modal-close"></div>
            <div className="modal-content">
                <div className="modal-card">
                    <header className="modal-card-head">
                        <h3>{ModalTitle}</h3>
                        <button className="h-modal-close ml-auto" aria-label="close" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </header>
                    <div className="modal-card-body">
                        <div className="inner-content">
                            {Type === 'image' && (
                                <div className="section-placeholder">
                                    <div className="placeholder-content">
                                        <div className="h-avatar is-xl">
                                            {/* <img className="avatar" src="" data-demo-src="assets/img/avatars/photos/22.jpg" alt=""></img> */}
                                        </div>
                                        <h3 className="dark-inverted">{Header}</h3>
                                        <p>{Subtext}</p>
                                    </div>
                                </div>
                            )}
                            {Type === 'custom' && Children}
                            
                        </div>
                    </div>
                    {hasButtons && (
                        <div className="modal-card-foot is-centered">
                            <a className="button h-button is-rounded h-modal-close">{SecondaryButtonText}</a>
                            <a className="button h-button is-primary is-raised is-rounded" onClick={onSubmit}>{PrimaryButtonText}</a>
                        </div>
                    )}

                    
                </div>
            </div>
        </div>
    );
};

export default Modal;