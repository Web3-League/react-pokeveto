import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface AntiPuce {
    id: string;
    anti_puce: boolean;
}

interface CustomAntiPuceProps {
    selectedRace: string;
    userId: string | null;
    selectedAnimalName: string;
}

const CustomAntiPuce: React.FC<CustomAntiPuceProps> = ({ userId, selectedAnimalName }) => {
    const [antiPuces, setAntiPuces] = useState<AntiPuce[]>([]);
    const [selectedAntiPuce, setSelectedAntiPuce] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [newAntiPuceValue, setNewAntiPuceValue] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        const fetchAntiPuces = async () => {
            try {
                let response;
                if (userRoles?.includes('ROLE_ADMIN')) {
                    response = await axios.get('http://localhost:8083/api/veterinaire/Admin-antipuces/'+ selectedAnimalName , { params: { name: selectedAnimalName } });
                } else {
                    response = await axios.get(`http://localhost:8083/api/veterinaire/antipuces/${userId}/${selectedAnimalName}`);
                }

                const data = response.data;
                setAntiPuces(data);
            } catch (error) {
                console.error('Error fetching antipuces:', error);
            }
        };

        if (selectedAnimalName) {
            fetchAntiPuces();
        }
    }, [selectedAnimalName, userId, userRoles]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAntiPuce(event.target.value);
    };

    const handleSecondDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiPuce(value);
        }
    };

    const handleBooleanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAntiPuceValue(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (newAntiPuceValue === '') {
            alert('Please select a value before submitting.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antipuces', { anti_puce: newAntiPuceValue, animal_name: selectedAnimalName });
            const data = response.data;
            setAntiPuces([...antiPuces, data]);
            setSelectedAntiPuce(data.id);
            setModalMessage('AntiPuce created successfully!');
            setModalOpen(true);
        } catch (error) {
            console.error('Error creating antipuce:', error);
            setModalMessage('Failed to create AntiPuce.');
            setModalOpen(true);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!selectedAnimalName) {
                console.error('Please select a race before submitting.');
                return;
            }

            const response = await axios.put(`http://localhost:8083/api/veterinaire/antipuces/${selectedAnimalName}`, { anti_puce: newAntiPuceValue });
            const data = response.data;
            const updatedAntiPuces = antiPuces.map((antiPuce) => (antiPuce.id === selectedAnimalName ? data : antiPuce));
            setAntiPuces(updatedAntiPuces);
            setModalMessage('AntiPuce updated successfully!');
            setModalOpen(true);
        } catch (error) {
            console.error('Error updating antipuce:', error);
            setModalMessage('Failed to update AntiPuce.');
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2>AntiPuces</h2>
            <form onSubmit={isEditMode ? handleUpdate : handleSubmit}>
                <select value={selectedAntiPuce} onChange={handleChange}>
                    <option value=''>Select an antipuce</option>
                    {antiPuces.map((antipuce) => (
                        antipuce.anti_puce != null ?( <option key={antipuce.id} value={antipuce.id}>{antipuce.anti_puce.toString()}</option> ) : null
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value=''>Select an action</option>
                    <option value='edit-mode'>Edit</option>
                </select>
                <ul>
                    {antiPuces.map((antipuce, index) => (
                        antipuce.anti_puce != null ?( <li key={index}>{antipuce.anti_puce.toString()}</li> ) : null
                    ))}
                </ul>
                {isEditMode && (
                    <select value={newAntiPuceValue} onChange={handleBooleanChange}>
                        <option value=''>Select a value</option>
                        <option value='true'>True</option>
                        <option value='false'>False</option>
                    </select>
                )}
                <button type='submit'>{isEditMode ? 'Update' : 'Submit'}</button>
            </form>
            {modalOpen && <CustomModal message={modalMessage!} onClose={() => setModalOpen(false)} open={modalOpen} />}
        </div>
    );
};

export default CustomAntiPuce;


