import React, { useState, useEffect } from "react";

interface ModalProps {
    ModalTitle: string;
    Header: string;
    Subtext: string;
    Image?: string;
    hasButtons: boolean;
    PrimaryButtonText: string;
    SecondaryButtonText: string;
    HasChildren: boolean;
    Children?: React.ReactNode;
    onSubmit: () => void;
    onClose: () => void;
}
const Modal: React.FC<ModalProps>= ({
    ModalTitle,
    Header,
    Subtext,
    hasButtons,
    PrimaryButtonText,
    SecondaryButtonText,
    HasChildren,
    Children,
    onSubmit,
    onClose
}) => {
    return (
        <div id="demo-right-actions-modal" className="modal h-modal is-active">
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
                            <div className="section-placeholder">
                                <div className="placeholder-content">
                                    <div className="h-avatar is-xl">
                                        {/* <img className="avatar" src="" data-demo-src="assets/img/avatars/photos/22.jpg" alt=""></img> */}
                                    </div>
                                    <h3 className="dark-inverted">{Header}</h3>
                                    <p>{Subtext}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {hasButtons && (
                        <div className="modal-card-foot is-centered">
                            <a className="button h-button is-rounded h-modal-close">{SecondaryButtonText}</a>
                            <a className="button h-button is-primary is-raised is-rounded" onClick={onSubmit}>{PrimaryButtonText}</a>
                        </div>
                    )}
                    {HasChildren && (
                        <>
                            {Children}
                        </>
                    )}

                    
                </div>
            </div>
        </div>
    );
};

export default Modal;