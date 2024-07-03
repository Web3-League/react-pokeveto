// src/components/custom/CustomBox.js
import React from 'react';
import './styles/CustomBox.css';

interface CustomBoxProps {
  children: React.ReactNode;
  gridColumn: string;
  gridRow: string;
}

const CustomBox: React.FC<CustomBoxProps> = ({ children, gridColumn, gridRow }) => {
  return (
    <div className="custom-box" style={{ gridColumn , gridRow}}>
      {children}
    </div>
  );
};

export default CustomBox;
