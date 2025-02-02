import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import useToken from '../hooks/useToken';
import './styles/CustomAnimalName.css';

interface AnimalName {
    id: string;
    animal_name: string;
}

interface CustomAnimalNameProps {
    selectedRace: string;
    selectedAnimalName: string;
    setSelectedAnimalName: (animalName: string) => void;
}

const CustomAnimalName: React.FC<CustomAnimalNameProps> = ({ selectedRace, selectedAnimalName, setSelectedAnimalName }) => {
    const { userId, userRoles } = useToken();
    const [animalNames, setAnimalNames] = useState<AnimalName[]>([]);
    const [newAnimalName, setNewAnimalName] = useState('');

    const fetchAnimalNames = useCallback(async () => {
        try {
            let response;

            if (userRoles?.includes('ROLE_ADMIN') && selectedRace) {
                response = await axios.get(`http://localhost:8083/api/veterinaire/allanimalname/` + selectedRace);
            } else {
                let id = userId;
                response = await axios.get(`http://localhost:8083/api/veterinaire/animalname/${id}/` + selectedRace);
            }

            setAnimalNames(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching animal names:', error);
            setAnimalNames([]);
        }
    }, [userId, userRoles, selectedRace]);

    useEffect(() => {
        if (selectedRace) {
            fetchAnimalNames();
        }
    }, [selectedRace, fetchAnimalNames]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAnimalName(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8083/api/veterinaire/animalname`, {
                animal_name: newAnimalName,
                owners: [userId],
                race_id: selectedRace
            });
            const data = response.data;
            setAnimalNames(Array.isArray(data) ? data : []);
            setSelectedAnimalName(data[0]?.id); // Correcting to set the ID
            setNewAnimalName('');
            fetchAnimalNames(); // Fetch updated list
        } catch (error) {
            console.error('Error creating animal name:', error);
        }
    };

    return (
        <div id="custom-animal-file">
            <h2>Animal Name</h2>
            <select value={selectedAnimalName} onChange={handleChange}>
                <option value="">Select Animal Name</option>
                {animalNames.map((animal) => (
                    animal.animal_name != null ? (
                        <option key={animal.id} value={animal.id}>
                            {animal.animal_name}
                        </option>
                    ) : null
                ))}
            </select>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newAnimalName}
                    onChange={(event) => setNewAnimalName(event.target.value)}
                    placeholder="Enter animal name"
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default CustomAnimalName;


