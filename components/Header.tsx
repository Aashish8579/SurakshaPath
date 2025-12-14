import React from 'react';
import { BellAlertIcon, ShieldCheckIcon, PhoneArrowDownLeftIcon } from './icons';

interface HeaderProps {
    onSosClick: () => void;
    onToggleCompanionMode: () => void;
    isCompanionModeActive: boolean;
    onFakeCallClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSosClick, onToggleCompanionMode, isCompanionModeActive, onFakeCallClick }) => {
    const companionButtonClasses = isCompanionModeActive
        ? "bg-green-600 hover:bg-green-700 shadow-green-900/50 hover:shadow-green-500/50"
        : "bg-gray-600 hover:bg-gray-700";

    const companionPulseClass = isCompanionModeActive ? "animate-pulse" : "";

    return (
        <header className="bg-gray-900/70 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-gray-700/50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
                        </svg>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white">SurakshaPath</h1>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                     <button
                        onClick={onFakeCallClick}
                        className="text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-blue-500 bg-gray-600 hover:bg-gray-700"
                        aria-label="Initiate Fake Call"
                        title="Initiate Fake Call"
                    >
                        <PhoneArrowDownLeftIcon className="w-5 h-5" />
                        <span className="hidden sm:inline font-semibold text-sm">Fake Call</span>
                    </button>
                    <button
                        onClick={onToggleCompanionMode}
                        className={`text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-green-500 ${companionButtonClasses}`}
                        aria-label={isCompanionModeActive ? "Deactivate Safe Companion Mode" : "Activate Safe Companion Mode"}
                        title={isCompanionModeActive ? "Safe Companion is Active" : "Activate Safe Companion Mode"}
                    >
                        <ShieldCheckIcon className={`w-5 h-5 ${companionPulseClass}`} />
                        <span className="hidden sm:inline font-semibold text-sm">Companion</span>
                    </button>
                     <button 
                        onClick={onSosClick}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-lg shadow-red-900/50 hover:shadow-red-500/50 transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-red-500"
                        aria-label="Send SOS alert"
                    >
                        <BellAlertIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">SOS</span>
                    </button>
                </div>
            </div>
        </header>
    );
};