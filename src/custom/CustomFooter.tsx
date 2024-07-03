import React from 'react';

interface CustomFooterProps extends React.HTMLAttributes<HTMLElement> {}

const CustomFooter: React.FC<CustomFooterProps> = (props) => {
    return <footer {...props}>{props.children}</footer>;
};

export default CustomFooter;

