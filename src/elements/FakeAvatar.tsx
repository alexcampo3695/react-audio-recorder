import React, { useState, useEffect, ReactElement, Suspense } from "react";
import { format } from "path";
import { useNavigate } from "react-router-dom";

enum AvatarSize {
    Small = "is-small",
    Normal = "",
    Medium = "is-medium",
    Large = "is-large",
    Big = "is-big",
    XL = "is-xl",
}

interface AvatarProps {
    FirstName: string
    LastName: string
    Size: AvatarSize
}

const FakeAvatar: React.FC<AvatarProps> = ({ FirstName, LastName, Size }) => {
    const getInitials = () => {
        const firstInitial = FirstName ? FirstName.charAt(0) : '';
        const lastInitial = LastName ? LastName.charAt(0) : '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }
    
    return (
        <div className={`h-avatar ${Size}`}>
            <span className="avatar is-fake">
                <span>{getInitials()}</span>
            </span>
        </div>
    )
};

export { AvatarSize };
export default FakeAvatar;