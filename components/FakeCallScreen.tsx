import React from 'react';
import { PhoneXMarkIcon } from './icons';

interface FakeCallScreenProps {
    isOpen: boolean;
    onEndCall: () => void;
}

export const FakeCallScreen: React.FC<FakeCallScreenProps> = ({ isOpen, onEndCall }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900 z-[2000] flex flex-col items-center justify-between p-8 text-white animate-fade-in"
            aria-modal="true" 
            role="dialog"
        >
            {/* Top Info */}
            <div className="text-center mt-12">
                <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4">
                    M
                </div>
                <h2 className="text-4xl font-semibold">Mom</h2>
                <p className="text-lg text-gray-400 mt-1">Mobile</p>
            </div>
            
            {/* Bottom Controls */}
            <div className="w-full max-w-xs">
                <div className="flex justify-center items-center gap-16">
                    {/* Decline Button */}
                    <div className="flex flex-col items-center">
                         <button 
                            onClick={onEndCall}
                            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-105 transition-transform"
                            aria-label="Decline Call"
                        >
                            <PhoneXMarkIcon className="w-10 h-10 text-white" />
                        </button>
                        <span className="mt-2 text-sm">Decline</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
