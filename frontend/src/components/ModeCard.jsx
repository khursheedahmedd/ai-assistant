import React from 'react';

const ModeCard = ({ title, description, onClick }) => {
    return (
        <div className="border p-4 rounded-lg shadow-lg hover:bg-blue-100 cursor-pointer" onClick={onClick}>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-gray-500">{description}</p>
        </div>
    );
};

export default ModeCard;
