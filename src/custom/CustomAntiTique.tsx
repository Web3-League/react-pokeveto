import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface CustomAntiTiqueProps {
    userId: string | null;
    selectedAnimalName: string;
}

interface AntiTique {
    nameId: string;
    anti_tique: boolean;
}

const CustomAntiTique: React.FC<CustomAntiTiqueProps> = ({ userId, selectedAnimalName }) => {
    const [antiTiques, setAntiTiques] = useState<AntiTique[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newAntiTiqueValue, setNewAntiTiqueValue] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const { userRoles } = useToken();

    const fetchAntiTiques = useCallback(async () => {
        try {
            let response;
            if (userRoles?.includes('ROLE_ADMIN')) {
                response = await axios.get(`http://localhost:8083/api/veterinaire/Admin-antitiques/${selectedAnimalName}`, { params: { name: selectedAnimalName } });
            } else {
                response = await axios.get(`http://localhost:8083/api/veterinaire/antitiques/${userId}/${selectedAnimalName}`);
            }
            setAntiTiques(response.data);
        } catch (error) {
            console.error('Error fetching antitiques:', error);
        }
    }, [selectedAnimalName, userId, userRoles]);

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);
        if (selectedAnimalName) {
            fetchAntiTiques();
        }
    }, [selectedAnimalName, userId, userRoles, fetchAntiTiques]);

    const handleSecondDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
            setIsDeleteMode(false);
        } else if (value === 'delete-mode') {
            setIsDeleteMode(true);
            setIsEditMode(false);
        } else {
            setIsEditMode(false);
            setIsDeleteMode(false);
        }
    };

    const handleBooleanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAntiTiqueValue(event.target.value === 'true');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antitiques', { anti_tique: newAntiTiqueValue, animal_name: selectedAnimalName });
            const data = response.data;
            setAntiTiques([...antiTiques, data]);
            setNewAntiTiqueValue(false);
            setModalMessage('AntiTique submitted successfully!');
            setModalOpen(true);
            fetchAntiTiques();
        } catch (error) {
            console.error('Error submitting antitique:', error);
            setModalMessage('Failed to submit AntiTique.');
            setModalOpen(true);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!selectedAnimalName) {
                console.error('No animal selected for update');
                return;
            }
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antitiques/${selectedAnimalName}`, { anti_tique: newAntiTiqueValue });
            const data = response.data;
            const updatedAntiTiques = antiTiques.map((antiTique) => (antiTique.nameId === selectedAnimalName ? data : antiTique));
            setAntiTiques(updatedAntiTiques);
            setModalMessage('AntiTique updated successfully!');
            setModalOpen(true);
            fetchAntiTiques();
        } catch (error) {
            console.error('Error updating antitique:', error);
            setModalMessage('Failed to update AntiTique.');
            setModalOpen(true);
        }
    };

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.delete(`http://localhost:8083/api/veterinaire/antitiques/${selectedAnimalName}`);
            const updatedAntiTiques = antiTiques.filter((antiTique) => antiTique.nameId !== selectedAnimalName);
            setAntiTiques(updatedAntiTiques);
            setModalMessage('AntiTique deleted successfully!');
            setModalOpen(true);
            fetchAntiTiques();
        } catch (error) {
            console.error('Error deleting antitique:', error);
            setModalMessage('Failed to delete AntiTique.');
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2>AntiTiques</h2>
            <select onChange={handleSecondDropdownChange}>
                <option value="">Select an option</option>
                {isAdmin && <option value="edit-mode">Edit Mode</option>}
                {isAdmin && <option value="delete-mode">Delete Mode</option>}
            </select>
            <ul>
                {antiTiques.map((antiTique, index) => (
                    antiTique.anti_tique != null ? (
                        <li key={index}>
                            {antiTique.anti_tique.toString() ?? 'undefined'}
                        </li>
                    ) : null
                ))}
            </ul>
            <div>
                <select value={newAntiTiqueValue.toString() ?? 'undefined'} onChange={handleBooleanChange}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
                <form onSubmit={handleSubmit}>
                    <button type="submit">Submit</button>
                </form>
            </div>
            {isEditMode && isAdmin && (
                <div>
                    <form onSubmit={handleUpdate}>
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
            {isAdmin && isDeleteMode && (
                <div>
                    <form onSubmit={handleDelete}>
                        <button type="submit">Delete</button>
                    </form>
                </div>
            )}
            <CustomModal message={modalMessage} onClose={() => setModalOpen(false)} open={modalOpen} />
        </div>
    );
};

export default CustomAntiTique;



