import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { Props } from "./interfaces";
import { format } from "path";
import { useNavigate } from "react-router-dom";
import FakeAvatar, { AvatarSize } from "../elements/FakeAvatar";
import formatDate from "../helpers/DataManipulation";


interface FlexItemProps {
    FirstName: string
    LastName: string
    DateOfBirth: string
}

const UserProfile: React.FC<FlexItemProps> = ({ FirstName, LastName, DateOfBirth }) => {
    return (
        <div className="profile-wrapper">
            <div className="profile-header has-text-centered">
                <div className="h-avatar is-xl">
                <FakeAvatar
                    FirstName={FirstName}
                    LastName={LastName}
                    Size={AvatarSize.Small}
                />
                </div>
                <h3 className="title is-4 is-narrow">Erik Kovalsky</h3>
                <p className="light-text">
                    Hey everyone, Iam a product manager from New York and Iam looking
                    for new opportunities in the software business.
                </p>
                <div className="profile-stats">
                    <div className="profile-stat">
                        <i className="lnil lnil-users-alt"></i>
                        <span>{FirstName} {LastName}</span>
                    </div>
                    <div className="separator"></div>
                    <div className="profile-stat">
                        <i className="lnil lnil-checkmark-circle"></i>
                        <span>{DateOfBirth}</span>
                    </div>
                    <div className="separator"></div>
                    <div className="socials">
                        <a><i aria-hidden="true" className="fab fa-facebook-f"></i></a>
                        <a><i aria-hidden="true" className="fab fa-twitter"></i></a>
                        <a><i aria-hidden="true" className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </div>
    )
};




export default UserProfile;