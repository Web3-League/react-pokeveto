import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface CustomAntiTiqueProps {
    userId: string | null;
    selectedAnimalName: string;
}

interface AntiTique {
   nameId: string;
}

const CustomAntiTique: React.FC<CustomAntiTiqueProps> = ({ userId, selectedAnimalName }) => {
    const [antiTiques, setAntiTiques] = useState<AntiTique[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newAntiTiqueValue, setNewAntiTiqueValue] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        const fetchAntiTiques = async () => {
            try {
                let response;
                if (userRoles?.includes('ROLE_ADMIN')) {
                    response = await axios.get('http://localhost:8083/api/veterinaire/Admin-antitiques', { params: { name: selectedAnimalName } });
                } else {
                    response = await axios.get(`http://localhost:8083/api/veterinaire/antitiques/${userId}/${selectedAnimalName}`);
                }
                setAntiTiques(response.data);
            } catch (error) {
                console.error('Error fetching antitiques:', error);
            }
        };

        if (selectedAnimalName) {
            fetchAntiTiques();
        }
    }, [selectedAnimalName, userId, userRoles]);

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
            setIsEditMode(false);
            setModalMessage('AntiTique created successfully!');
            setModalOpen(true); // Open modal
        } catch (error) {
            console.error('Error creating antitique:', error);
            setModalMessage('Failed to create AntiTique.');
            setModalOpen(true); // Open modal
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
            setModalOpen(true); // Open modal
        } catch (error) {
            console.error('Error updating antitique:', error);
            setModalMessage('Failed to update AntiTique.');
            setModalOpen(true); // Open modal
        }
    };

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.delete(`http://localhost:8083/api/veterinaire/antitiques/${selectedAnimalName}`);
            const updatedAntiTiques = antiTiques.filter((antiTique) => antiTique.nameId !== selectedAnimalName);
            setAntiTiques(updatedAntiTiques);
            setModalMessage('AntiTique deleted successfully!');
            setModalOpen(true); // Open modal
        } catch (error) {
            console.error('Error deleting antitique:', error);
            setModalMessage('Failed to delete AntiTique.');
            setModalOpen(true); // Open modal
        }
    };

    return (
        <div>
            <h2>AntiTiques</h2>
            <select value={selectedAnimalName} onChange={handleSecondDropdownChange}>
                <option value="">Select an option</option>
                <option value="edit-mode">Edit Mode</option>
                <option value="delete-mode">Delete Mode</option>
            </select>
            {isEditMode && (
                <div>
                    <div>SELECTED ANIMAL NAME: {selectedAnimalName}</div>
                    <form onSubmit={handleUpdate}>
                        <select value={newAntiTiqueValue.toString()} onChange={handleBooleanChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        <button type="submit">Update</button>
                    </form>
                </div>
            )}
            {isAdmin && (
                <div>
                    <form onSubmit={handleSubmit}>
                        <select value={newAntiTiqueValue.toString()} onChange={handleBooleanChange}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                        <button type="submit">Create</button>
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
            <CustomModal message={modalMessage!} onClose={() => setModalOpen(false)} open={modalOpen} />
        </div>
    );
};

export default CustomAntiTique;


