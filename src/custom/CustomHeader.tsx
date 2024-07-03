import React from 'react';

interface CustomHeaderProps {
    userId: string;
    selectedRace: string
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ userId , selectedRace}) => {
    return <header>
        <h1>POKE-VETO</h1>
        <div> USER PROFILE : {userId} </div>
        <div> RACE : {selectedRace} </div>
    </header>;
};

export default CustomHeader;
