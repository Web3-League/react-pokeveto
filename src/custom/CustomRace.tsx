import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';
/*{/veterinaire}*/
interface CustomRaceProps {
    selectedRace: string;
    setSelectedRace: React.Dispatch<React.SetStateAction<string>>;
    userId: string | null;
}

interface Race {
    id: string;
    raceId: string;
    race: string;
}

const CustomRace: React.FC<CustomRaceProps> = ({ selectedRace, setSelectedRace }) => {
    const [races, setRaces] = useState<Race[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newRaceName, setNewRaceName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const { userId, userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        const fetchRaces = async () => {
            try {
                let response;
                if (userRoles?.includes('ROLE_ADMIN')) {
                    response = await axios.get('http://localhost:8083/api/races/all');
                } else {
                    let id = userId;
                    response = await axios.get('http://localhost:8083/api/races/all');
                }
                setRaces(response.data);
            } catch (error) {
                console.error('Error fetching races:', error);
            }
        };

        fetchRaces();
    }, [userId, userRoles, isAdmin]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRace(event.target.value);
    };

    const handleSecondDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
            setNewRaceName('');
        } else {
            setIsEditMode(false);
            setSelectedRace(value);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRaceName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isEditMode && selectedRace) {
                const response = await axios.put(`http://localhost:8083/api/races/${selectedRace}`, { race_id: newRaceName });
                const updatedRace = response.data;
                setRaces(races.map((race) => (race.id === updatedRace.id ? updatedRace : race)));
                setSelectedRace(updatedRace.id);
            } else {
                const response = await axios.post('http://localhost:8083/api/races/race', { race_id: newRaceName });
                const data = response.data;
                setRaces([...races, data]);
                setSelectedRace(data.id);
            }
            setNewRaceName('');
            setIsEditMode(false);
        } catch (error) {
            console.error('Error creating/updating race:', error);
        }
    };

    return (
        <div>
            <h2>Races</h2>
            <div>
                <div>ANIMAL ID: {selectedRace} USER ID: {userId}</div>
                <select className="form-control" name="race" value={selectedRace} onChange={handleChange}>
                    <option value="">Select a race</option>
                    {races.map((races) => (
                        <option key={races.id} value={races.id}>
                            {races.race}
                        </option>
                    ))}
                </select>
            </div>
            {isAdmin && (
                <div>
                    <div>ROLE_ADMIN: {isAdmin ? 'Yes' : 'No'}</div>
                    <select className="form-control" name="race" value={selectedRace} onChange={handleSecondDropdownChange}>
                        <option value="">Select a race</option>
                        {races.map((races) => (
                            <option key={races.id} value={races.id}>
                                {races.race}
                            </option>
                        ))}
                        <option value="edit-mode">Edit Mode</option>
                    </select>
                    {isEditMode && (
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter new race name"
                                value={newRaceName}
                                onChange={handleInputChange}
                            />
                            <form onSubmit={handleSubmit}>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CustomRace;
