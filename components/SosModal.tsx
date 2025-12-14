import React from 'react';
import { ExclamationTriangleIcon } from './icons';

interface SosModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    location: { lat: number; lng: number };
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onConfirm, onCancel, location }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md animate-fade-in">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="flex-grow text-left">
                            <h3 className="text-lg font-bold leading-6 text-white" id="modal-title">
                                Confirm SOS Alert
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-300">
                                    You are about to send an emergency alert. This action is irreversible and should only be used in a genuine emergency.
                                </p>
                                <p className="mt-3 text-sm text-gray-400 bg-gray-900/50 p-2 rounded-md">
                                    Your current location will be sent: <br/>
                                    <span className="font-mono text-indigo-300">Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}</span>
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
                        className="w-full justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:w-auto transition-colors"
                        onClick={onConfirm}
                    >
                        Confirm Alert
                    </button>
                </div>
            </div>
        </div>
    );
};