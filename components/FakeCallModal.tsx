import React, { useState } from 'react';
import type { FakeCallOptions, FakeCallVoice, FakeCallTone } from '../types';
import { PhoneArrowDownLeftIcon } from './icons';

interface FakeCallModalProps {
    isOpen: boolean;
    onStart: (options: FakeCallOptions) => void;
    onCancel: () => void;
}

const SCENARIOS = [
    "I'm waiting outside, come fast.",
    "Your cab is nearby, please come down now.",
    "Hey, are you done? I'm getting late and need to leave.",
    "The movie is about to start, where are you?"
];

export const FakeCallModal: React.FC<FakeCallModalProps> = ({ isOpen, onStart, onCancel }) => {
    const [voice, setVoice] = useState<FakeCallVoice>('female');
    const [tone, setTone] = useState<FakeCallTone>('calm');
    const [message, setMessage] = useState<string>(SCENARIOS[0]);

    if (!isOpen) return null;

    const handleStart = () => {
        onStart({ voice, tone, message });
    };

    const OptionButton: React.FC<{
        onClick: () => void;
        isActive: boolean;
        children: React.ReactNode;
    }> = ({ onClick, isActive, children }) => (
        <button
            type="button"
            onClick={onClick}
            className={`w-full p-3 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${isActive ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-gray-700/50 border-transparent hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md animate-fade-in">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                         <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-900/50">
                            <PhoneArrowDownLeftIcon className="h-6 w-6 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold leading-6 text-white" id="modal-title">
                            Setup Smart Fake Call
                        </h3>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Voice</label>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionButton onClick={() => setVoice('female')} isActive={voice === 'female'}>Female</OptionButton>
                                <OptionButton onClick={() => setVoice('male')} isActive={voice === 'male'}>Male</OptionButton>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                            <div className="grid grid-cols-2 gap-3">
                                <OptionButton onClick={() => setTone('calm')} isActive={tone === 'calm'}>Calm</OptionButton>
                                <OptionButton onClick={() => setTone('urgent')} isActive={tone === 'urgent'}>Urgent</OptionButton>
                            </div>
                        </div>

                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-2">Scenario</label>
                             <select 
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-gray-700/50 text-white p-3 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition"
                            >
                                {SCENARIOS.map((scenario, index) => (
                                    <option key={index} value={scenario}>{scenario}</option>
                                ))}
                             </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-xl">
                    <button
                        type="button"
                        className="w-full justify-center rounded-md bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:w-auto transition-colors"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="w-full justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 sm:w-auto transition-colors"
                        onClick={handleStart}
                    >
                        Start Call
                    </button>
                </div>
            </div>
        </div>
    );
};
