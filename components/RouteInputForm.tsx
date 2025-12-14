import React, { useState } from 'react';
import type { TransportMode } from '../types';
import { CarIcon, BikeIcon, WalkIcon, LocationMarkerIcon, StartIcon, EndIcon } from './icons';

interface RouteInputFormProps {
    onFindRoute: (start: string, end: string, mode: TransportMode) => void;
    isLoading: boolean;
}

export const RouteInputForm: React.FC<RouteInputFormProps> = ({ onFindRoute, isLoading }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [mode, setMode] = useState<TransportMode>('walking');
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            setIsGettingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setStart(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                    setIsGettingLocation(false);
                },
                (error) => {
                    let message = "Could not retrieve your location. Please ensure location services are enabled and permissions are granted in your browser settings.";
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            message = "Location permission denied. Please enable it in your browser settings to use this feature.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = "Location information is currently unavailable. Please check your device's GPS or try again.";
                            break;
                        case error.TIMEOUT:
                            message = "The request to get your location timed out. Please try again.";
                            break;
                    }
                    console.error("Error getting location: ", error.message);
                    alert(message);
                    setIsGettingLocation(false);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFindRoute(start, end, mode);
    };

    return (
        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border border-gray-700/50">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative rounded-lg focus-glow transition-shadow duration-300">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <StartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        placeholder="Starting point"
                        className="w-full bg-gray-700/50 text-white p-3 pl-10 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition"
                        disabled={isLoading}
                    />
                     <button 
                        type="button" 
                        onClick={handleGeolocation} 
                        disabled={isLoading || isGettingLocation} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors p-1.5 rounded-full hover:bg-gray-700 disabled:cursor-wait disabled:text-indigo-400"
                        title="Use current location"
                    >
                        {isGettingLocation ? (
                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <LocationMarkerIcon />
                        )}
                    </button>
                </div>
                <div className="relative rounded-lg focus-glow transition-shadow duration-300">
                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <EndIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        placeholder="Destination"
                        className="w-full bg-gray-700/50 text-white p-3 pl-10 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition"
                        disabled={isLoading}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {(['walking', 'bike', 'car'] as TransportMode[]).map((transportMode) => {
                        const isActive = mode === transportMode;
                        return (
                            <button
                                key={transportMode}
                                type="button"
                                onClick={() => setMode(transportMode)}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 border-2 ${isActive ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-gray-700/50 border-transparent hover:bg-gray-700'}`}
                            >
                                {transportMode === 'walking' && <WalkIcon />}
                                {transportMode === 'bike' && <BikeIcon />}
                                {transportMode === 'car' && <CarIcon />}
                                <span className={`text-xs font-semibold mt-1 capitalize`}>{transportMode}</span>
                            </button>
                        );
                    })}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-indigo-500/50 transform hover:-translate-y-0.5"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Finding Route...
                        </>
                    ) : (
                        'Find Route'
                    )}
                </button>
            </form>
        </div>
    );
};