import React from 'react';

interface CustomImageProps {
    src: string;
    alt: string;
}

const CustomImage: React.FC<CustomImageProps> = (props) => {
    return <img {...props} />;
};

export default CustomImage;
