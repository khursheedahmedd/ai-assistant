import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const modes = [
    { name: 'Picture Mode', description: 'Capture or upload an image for processing' },
    { name: 'Language Translation', description: 'Translate languages with text or speech' },
    { name: 'Assistant Mode', description: 'Ask questions and get answers' },
    { name: 'Health Mode', description: 'Get personalized health recommendations' },
    { name: 'Learn Mode', description: 'Learn from images and documents' },
    { name: 'Speak Mode', description: 'Speak with friends in their voice' }
];

const HomePage = () => {
    const [showModes, setShowModes] = useState(false);

    const toggleModeSelector = () => {
        setShowModes(!showModes);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 to-purple-400 py-6 ">
            <h1 className="text-4xl font-bold text-white mb-8 animate__animated animate__fadeIn mt-[4rem]">Welcome to Mode App</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modes.map((mode, index) => (
                    <Link key={index} to={`/${mode.name.toLowerCase().replace(' ', '-')}`}>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 duration-300 ease-in-out">
                            <h2 className="text-xl font-bold text-gray-800">{mode.name}</h2>
                            <p className="mt-2 text-gray-600">{mode.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Change Mode Button */}
            <button
                className="fixed top-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
                onClick={toggleModeSelector}
            >
                Change Mode
            </button>

            {/* Mode Selector Modal */}
            {showModes && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">Select a Mode</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {modes.map((mode, index) => (
                                <Link key={index} to={`/${mode.name.toLowerCase().replace(' ', '-')}`}>
                                    <div className="bg-blue-100 p-4 rounded-lg shadow hover:bg-blue-200 transition-colors duration-300">
                                        {mode.name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
                            onClick={toggleModeSelector}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
