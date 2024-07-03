import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useToken from '../hooks/useToken';
import CustomModal from './CustomModalAdmin';

interface CustomTraitementProps {
    userId: string | null;
    selectedAnimalName: string;
}

interface Traitement {
    traitement: string;
}

const CustomTraitement: React.FC<CustomTraitementProps> = ({ userId, selectedAnimalName }) => {
    const [traitements, setTraitements] = useState<Traitement[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newTraitementValue, setNewTraitementValue] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { userRoles } = useToken();

    useEffect(() => {
        setIsAdmin(userRoles?.includes('ROLE_ADMIN') ?? false);

        const fetchTraitements = async () => {
            try {
                let response;
                if (userRoles?.includes('ROLE_ADMIN')) {
                    response = await axios.get('http://localhost:8083/api/veterinaire/Admin-traitements', { params: { animal_name: selectedAnimalName } });
                } else {
                    response = await axios.get(`http://localhost:8083/api/veterinaire/traitements/${userId}/${selectedAnimalName}`);
                }
                setTraitements(response.data);
            } catch (error) {
                console.error('Error fetching traitements:', error);
            }
        };

        if (selectedAnimalName) {
            fetchTraitements();
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

    const handleNewTraitementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTraitementValue(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (isEditMode) {
                const response = await axios.post(`http://localhost:8083/api/veterinaire/traitements/`+ selectedAnimalName, {  animal_name: selectedAnimalName ,traitement: newTraitementValue});
                const data = response.data;
                setTraitements([...traitements, data]);
                setIsEditMode(false);
                setNewTraitementValue('');
                setModalMessage('Traitement updated successfully!');
                setModalOpen(true);
            } else if (isDeleteMode) {
                await axios.delete(`http://localhost:8083/api/veterinaire/traitements/${selectedAnimalName}`);
                setIsDeleteMode(false);
                setModalMessage('Traitement deleted successfully!');
                setModalOpen(true);
            } else {
                const response = await axios.put('http://localhost:8083/api/veterinaire/traitements/'+ selectedAnimalName, { traitement: newTraitementValue, animal_name: selectedAnimalName });
                const data = response.data;
                setTraitements([...traitements, data]);
                setNewTraitementValue('');
                setModalMessage('Traitement created successfully!');
                setModalOpen(true);
            }
        } catch (error) {
            console.error('Error creating traitement:', error);
            setModalMessage('Traitement created successfully!');
            setModalOpen(true);
        }
    };

    return (
        <div>
            <h2>Traitements</h2>
            <div>SELECTED ANIMAL NAME: {selectedAnimalName}</div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={newTraitementValue} onChange={handleNewTraitementChange} />
                <button type="submit">Submit</button>
                <select onChange={handleSecondDropdownChange}>
                    <option value="default">Select an action</option>
                    <option value="edit-mode">Edit</option>
                    <option value="delete-mode">Delete</option>
                </select>
            </form>
            <ul>
                {traitements.map((traitement) => (
                    <li key={traitement.traitement}>{traitement.traitement}</li>
                ))}
            </ul>
            <CustomModal message={modalMessage!} onClose={() => setModalOpen(false)} open={modalOpen} />

        </div>
    );
};

export default CustomTraitement;

