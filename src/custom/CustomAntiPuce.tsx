import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
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
    const [selectedAction, setSelectedAction] = useState('');
    const [selectedAntiPuce, setSelectedAntiPuce] = useState<string>('');
    const [newAntiPuceValue, setNewAntiPuceValue] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const { userRoles } = useToken();


    const fetchAntiPuces = useCallback(async () => {
        try {
            let response;
            if (userRoles?.includes('ROLE_ADMIN')) {
                response = await axios.get(`http://localhost:8083/api/veterinaire/Admin-antipuces/${selectedAnimalName}`, { params: { name: selectedAnimalName } });
            } else {
                response = await axios.get(`http://localhost:8083/api/veterinaire/antipuces/${userId}/${selectedAnimalName}`);
            }
            const data = response.data;
            setAntiPuces(data);
        } catch (error) {
            console.error('Error fetching antipuces:', error);
        }
    }, [selectedAnimalName, userId, userRoles]);

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        if (selectedAnimalName) {
            fetchAntiPuces();
        }
    }, [selectedAnimalName, userId, userRoles, fetchAntiPuces]);

    const handleActionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedAction(value);

        if (value !== 'create' && value !== 'edit' && value !== 'delete') {
            setSelectedAntiPuce(value);
        } else {
            setSelectedAntiPuce('');
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

        if (selectedAction === 'create') {
            try {
                const response = await axios.post('http://localhost:8083/api/veterinaire/antipuces', { anti_puce: newAntiPuceValue, animal_name: selectedAnimalName });
                const data = response.data;
                setAntiPuces([...antiPuces, data]);
                setSelectedAntiPuce(data.id);
                setModalMessage('AntiPuce created successfully!');
                setModalOpen(true);
                fetchAntiPuces();
            } catch (error) {
                console.error('Error creating antipuce:', error);
                setModalMessage('Failed to create AntiPuce.');
                setModalOpen(true);
            }
        } else if (selectedAction === 'edit') {
            handleUpdate(event);
        } else if (selectedAction === 'delete') {
            handleDelete(event);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!selectedAnimalName) {
                console.error('Please select an animal name before submitting.');
                return;
            }

            const response = await axios.put(`http://localhost:8083/api/veterinaire/antipuces/${selectedAnimalName}`, { anti_puce: newAntiPuceValue });
            const data = response.data;
            const updatedAntiPuces = antiPuces.map((antiPuce) => (antiPuce.id === selectedAntiPuce ? data : antiPuce));
            setAntiPuces(updatedAntiPuces);
            setModalMessage('AntiPuce updated successfully!');
            setModalOpen(true);
            fetchAntiPuces();
        } catch (error) {
            console.error('Error updating antipuce:', error);
            setModalMessage('Failed to update AntiPuce.');
            setModalOpen(true);
        }
    };

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.delete(`http://localhost:8083/api/veterinaire/antipuces/${selectedAntiPuce}`);
            const updatedAntiPuces = antiPuces.filter((antiPuce) => antiPuce.id !== selectedAntiPuce);
            setAntiPuces(updatedAntiPuces);
            setModalMessage('AntiPuce deleted successfully!');
            setModalOpen(true);
            fetchAntiPuces();
        } catch (error) {
            console.error('Error deleting antipuce:', error);
            setModalMessage('Failed to delete AntiPuce.');
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2>AntiPuces</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedAction} onChange={handleActionChange}>
                    <option value='create'>AntiPuce</option>
                    {antiPuces.map((antipuce) => (
                        antipuce.anti_puce != null ? (
                            <option key={antipuce.id} value={antipuce.id}>{antipuce.anti_puce.toString() ?? 'undefined'}</option>
                        ) : null
                    ))}
                    {isAdmin && <option value='edit'>Edit</option>}
                    {isAdmin && <option value='delete'>Delete</option>}
                </select>
                {(selectedAction === 'create' || selectedAction === 'edit') && (
                    <div>
                        <select value={newAntiPuceValue} onChange={handleBooleanChange}>
                            <option value=''>Select a value</option>
                            <option value='true'>True</option>
                            <option value='false'>False</option>
                        </select>
                    </div>
                )}
                <button type='submit'>
                    {selectedAction === 'edit' ? 'Update' : selectedAction === 'delete' ? 'Delete' : 'Submit'}
                </button>
            </form>
            <ul>
                {antiPuces.map((antipuce, index) => (
                    antipuce.anti_puce != null ? (<li key={index}>{antipuce.anti_puce.toString() ?? 'undefined'}</li>) : null
                ))}
            </ul>
            {modalOpen && <CustomModal message={modalMessage} onClose={() => setModalOpen(false)} open={modalOpen} />}
        </div>
    );
};

export default CustomAntiPuce;


