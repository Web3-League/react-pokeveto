import React from 'react';

interface CustomTextProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CustomText: React.FC<CustomTextProps> = (props) => {
    return <p {...props}>{props.children}</p>;
};

export default CustomText;

