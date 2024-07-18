import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface AntiVirus {
    id: string;
    anti_virus: boolean;
    nameId: string;
}

interface CustomAntiVirusProps {
    selectedAnimalName: string;
    userId: string;
}

const CustomAntiVirus: React.FC<CustomAntiVirusProps> = ({ userId, selectedAnimalName }) => {
    const [antiVirus, setAntiVirus] = useState<AntiVirus[]>([]);
    const [selectedAntiVirus, setSelectedAntiVirus] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [newAntiVirusValue, setNewAntiVirusValue] = useState<string>('');
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { userRoles } = useToken();

    const fetchAntiVirus = useCallback(async () => {
        try {
            let response;

            if (userRoles?.includes('ROLE_ADMIN')) {
                response = await axios.get('http://localhost:8083/api/veterinaire/Admin-antiVirus', { params: { name: selectedAnimalName } });
            } else {
                let id = userId;
                response = await axios.get(`http://localhost:8083/api/veterinaire/antiVirus/${id}/${selectedAnimalName}`);
            }

            const data = response.data;
            setAntiVirus(data);
        } catch (error) {
            console.error('Error fetching antiVirus:', error);
        }
    }, [selectedAnimalName, userId, userRoles]);

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        if (selectedAnimalName) {
            fetchAntiVirus();
        }
    }, [selectedAnimalName, userId, userRoles, fetchAntiVirus]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAntiVirus(event.target.value);
    };

    const handleSecondDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiVirus(value);
        }
    };

    const handleBooleanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAntiVirusValue(event.target.value === 'true' ? 'true' : 'false');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antiVirus', { anti_virus: newAntiVirusValue, name: selectedAnimalName });
            const data = response.data;
            setAntiVirus([...antiVirus, data]);
            setSelectedAntiVirus(data.id);
            setModalMessage('AntiVirus created successfully!');
            setModalOpen(true);
            fetchAntiVirus();
        } catch (error) {
            console.error('Error creating antiVirus:', error);
            setModalMessage('Error creating AntiVirus!');
            setModalOpen(true);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antiVirus/${selectedAnimalName}`, { anti_virus: newAntiVirusValue });
            const data = response.data;
            const updatedAntiVirus = antiVirus.map((item) => (item.nameId === selectedAnimalName ? data : item));
            setAntiVirus(updatedAntiVirus);
            setModalMessage('AntiVirus updated successfully!');
            setModalOpen(true);
            fetchAntiVirus();
        } catch (error) {
            console.error('Error updating antiVirus:', error);
            setModalMessage('Error updating AntiVirus!');
            setModalOpen(true);
        }
    };

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await axios.delete(`http://localhost:8083/api/veterinaire/antiVirus/${selectedAnimalName}`);
            const updatedAntiVirus = antiVirus.filter((item) => item.id !== selectedAnimalName);
            setAntiVirus(updatedAntiVirus);
            setSelectedAntiVirus('');
            setModalMessage('AntiVirus deleted successfully!');
            setModalOpen(true);
            fetchAntiVirus();
        } catch (error) {
            console.error('Error deleting antiVirus:', error);
            setModalMessage('Error deleting AntiVirus!');
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2>Anti-Virus</h2>
            <div>
                <div>SELECTED RACE ID: {selectedAnimalName}</div>
                <select value={selectedAntiVirus} onChange={handleChange}>
                    <option value="">antiVirus</option>
                    {antiVirus.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.anti_virus?.toString() ?? 'undefined'}
                        </option>
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value="">Select an action</option>
                    <option value="edit-mode">Edit Mode</option>
                </select>
                <ul>
                    {antiVirus.map((item, index) => (
                        <li key={index}>
                            {item.anti_virus?.toString() ?? 'undefined'}
                        </li>
                    ))}
                </ul>
                {isEditMode && (
                    <select value={newAntiVirusValue} onChange={handleBooleanChange}>
                        <option value="">Select a value</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                )}
            </div>
            <div>
                {isEditMode ? (
                    <form onSubmit={handleUpdate}>
                        <button type="submit">Update</button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <button type="submit">Create</button>
                    </form>
                )}
            </div>
            {isAdmin && (
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

export default CustomAntiVirus;


