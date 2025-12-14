import React from 'react';
import { ShieldCheckIcon } from './icons';

interface CompanionModeModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const CompanionModeModal: React.FC<CompanionModeModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-lg animate-fade-in">
                <div className="p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-900/50">
                            <ShieldCheckIcon className="h-7 w-7 text-green-400" aria-hidden="true" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-bold leading-6 text-white" id="modal-title">
                                Activate Safe Companion Mode?
                            </h3>
                            <div className="mt-4 space-y-3 text-sm text-gray-300">
                                <p>
                                    When activated, AstraPath will use your device's microphone to listen for distress keywords. This feature is designed to provide hands-free help in an emergency.
                                </p>
                                <div className="text-left bg-gray-900/50 p-4 rounded-lg">
                                    <p className="font-semibold text-indigo-300">It will listen for keywords like:</p>
                                    <ul className="list-disc list-inside mt-2 text-gray-400">
                                        <li>"Help"</li>
                                        <li>"Stop"</li>
                                        <li>"Leave me"</li>
                                    </ul>
                                </div>
                                <div className="text-left bg-gray-900/50 p-4 rounded-lg">
                                    <p className="font-semibold text-red-400">If a keyword is detected, it will automatically:</p>
                                    <ul className="list-disc list-inside mt-2 text-gray-400">
                                        <li>Share your live location with authorities.</li>
                                        <li>Start recording audio and video.</li>
                                        <li>Initiate a call to emergency services (112).</li>
                                    </ul>
                                </div>
                                <p className="text-xs text-gray-500 pt-2">
                                    This feature requires microphone and camera permissions to function. Your privacy is important; audio is processed on-device and is not stored unless a distress signal is confirmed.
                                </p>
                            </div>
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
                        className="w-full justify-center rounded-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:w-auto transition-colors"
                        onClick={onConfirm}
                    >
                        Activate Mode
                    </button>
                </div>
            </div>
        </div>
    );
};