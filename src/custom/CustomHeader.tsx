import React from 'react';
import './styles/CustomHeader.css';

interface CustomHeaderProps {
    userId: string;
    selectedRace: string;
    isAdmin: boolean;
    selectedAnimalName: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ userId, selectedRace, isAdmin, selectedAnimalName }) => {
    return <header>
        <div className="custom-logo">
            <div className="logo-girafe"></div>
            <h1>POKE-VETO</h1>
        </div>
        <div> USER PROFILE : {userId} </div>
        <div> RACE : {selectedRace} </div>
        <div>ROLE_ADMIN: {isAdmin ? 'Yes' : 'No'}</div>
        <div>SELECTED ANIMAL : {selectedAnimalName}</div>
    </header>;
};

export default CustomHeader;
