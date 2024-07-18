import React from 'react';
import './styles/CustomFooter.css';

interface CustomFooterProps extends React.HTMLAttributes<HTMLElement> { }

const CustomFooter: React.FC<CustomFooterProps> = (props) => {
    return <footer {...props}>
        <p>TIME-SCOPE © 2024</p>
    </footer>;
};

export default CustomFooter;

