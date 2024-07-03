import axios from 'axios';
import React, { useState, useEffect } from 'react';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface AntiBacterie {
    id: string;
    nameId: string;
    anti_bacterie: boolean;
}

interface CustomAntiBacterieProps {
    userId: string | null;
    selectedAnimalName: string;
}

const CustomAntiBacterie: React.FC<CustomAntiBacterieProps> = ({ userId, selectedAnimalName }) => {
    const [antiBacteries, setAntiBacteries] = useState<AntiBacterie[]>([]);
    const [selectedAntiBacterie, setSelectedAntiBacterie] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [newAntiBacterieValue, setNewAntiBacterieValue] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const { userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        const fetchAntiBacteries = async () => {
            try {
                let response;
                if (userRoles?.includes('ROLE_ADMIN')) {
                    response = await axios.get('http://localhost:8083/api/veterinaire/Admin-antibacteries', { params: { name: selectedAnimalName } });
                } else {
                    let id = userId;
                    response = await axios.get('http://localhost:8083/api/veterinaire/antibacteries/' + id + '/' + selectedAnimalName);
                }

                const data = response.data;
                setAntiBacteries(data);
            } catch (error) {
                console.error('Error fetching antiBacteries:', error);
            }
        };

        if (selectedAnimalName) {
            fetchAntiBacteries();
        }
    }, [selectedAnimalName, userId, userRoles]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAntiBacterie(event.target.value);
    };

    const handleSecondDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === 'edit-mode') {
            setIsEditMode(true);
        } else {
            setIsEditMode(false);
            setSelectedAntiBacterie(value);
        }
    };

    const handleBooleanChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setNewAntiBacterieValue(event.target.value === 'true');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8083/api/veterinaire/antibacteries', { anti_bacterie: newAntiBacterieValue, animal_name: selectedAnimalName });
            const data = response.data;
            setAntiBacteries([...antiBacteries, data]);
            setSelectedAntiBacterie(data.id);
            setModalMessage('AntiTique created successfully!');
            setModalOpen(true);
        } catch (error) {
            console.error('Error creating antiBacterie:', error);
            setModalMessage('AntiTique created successfully!');
            setModalOpen(true);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!selectedAnimalName) {
                console.error('No race selected for update');
                return;
            }
            const response = await axios.put(`http://localhost:8083/api/veterinaire/antibacteries/${selectedAnimalName}`, { anti_bacterie: newAntiBacterieValue });
            const data = response.data;
            const updatedAntiBacteries = antiBacteries.map((antiBacterie) => (antiBacterie.nameId === selectedAnimalName ? data : antiBacterie));
            setAntiBacteries(updatedAntiBacteries);
            setSelectedAntiBacterie(data.id);
        } catch (error) {
            console.error('Error updating antiBacterie:', error);
        }
    };

    const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!selectedAntiBacterie) {
                console.error('No antiBacterie selected for deletion');
                return;
            }
            await axios.delete(`http://localhost:8083/api/veterinaire/antibacteries/${selectedAntiBacterie}`);
            const updatedAntiBacteries = antiBacteries.filter((antiBacterie) => antiBacterie.nameId !== selectedAntiBacterie);
            setAntiBacteries(updatedAntiBacteries);
            setSelectedAntiBacterie('');
        } catch (error) {
            console.error('Error deleting antiBacterie:', error);
        }
    };

    return (
        <div>
            <h2>Anti-Bacterie</h2>
            <div>
                <div>SELECTED RACE ID: {selectedAnimalName}</div>
                <select value={selectedAntiBacterie} onChange={handleChange}>
                    <option value="">Select an antiBacterie</option>
                    {antiBacteries.map((antiBacterie) => (
                        <option key={antiBacterie.id} value={antiBacterie.id}>
                            {antiBacterie.anti_bacterie.toString()}
                        </option>
                    ))}
                </select>
                <select onChange={handleSecondDropdownChange}>
                    <option value="">Select an action</option>
                    <option value="edit-mode">Edit Mode</option>
                </select>
                {isEditMode && (
                    <select value={newAntiBacterieValue.toString()} onChange={handleBooleanChange}>
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

export default CustomAntiBacterie;

