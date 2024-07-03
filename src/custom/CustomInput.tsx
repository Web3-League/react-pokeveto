import React from 'react';

interface CustomInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomInput: React.FC<CustomInputProps> = ({ type, placeholder, value, onChange }) => {
    return <input type={type} placeholder={placeholder} value={value} onChange={onChange} />;
};

export default CustomInput;

