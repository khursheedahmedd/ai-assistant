import React from 'react';

const ModeSwitcher = ({ onSelectMode }) => {
    const modes = ['Picture Mode', 'Language Translation Mode', 'Assistant Mode', 'Health Mode', 'Learn Mode', 'Speech Mode'];

    return (
        <div className="fixed top-4 right-4">
            <button className="bg-blue-500 text-white p-2 rounded-lg">Change Mode</button>
            <div className="bg-white p-4 rounded shadow-lg mt-2">
                {modes.map((mode, index) => (
                    <button key={index} onClick={() => onSelectMode(mode)} className="block w-full p-2 hover:bg-gray-200">
                        {mode}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ModeSwitcher;
