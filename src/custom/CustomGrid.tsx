import React from 'react';
import './styles/CustomGrid.css';

interface CustomGridProps {
  children: React.ReactNode;
}

const CustomGrid: React.FC<CustomGridProps> = ({ children }) => (
  <div className="custom-grid">
    {children}
  </div>
);

interface CustomBoxProps {
  children: React.ReactNode;
  gridColumn: string;
  gridRow: string;
}

const CustomBox: React.FC<CustomBoxProps> = ({ children, gridColumn, gridRow }) => (
  <div style={{ gridColumn, gridRow }} className="custom-box">
    {children}
  </div>
);

export { CustomGrid, CustomBox };


