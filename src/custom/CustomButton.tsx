import React from 'react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
    return <button {...props}>{props.children}</button>;
};

export default CustomButton;

