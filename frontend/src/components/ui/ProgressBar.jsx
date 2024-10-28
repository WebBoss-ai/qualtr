import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full h-4 bg-gray-200 rounded-lg mt-4">
            <div
                className="h-full bg-green-600 rounded-lg transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
