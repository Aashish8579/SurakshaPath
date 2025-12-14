import React, { useState } from 'react';
import type { RouteData, SafetyPoint, RouteStep } from '../types';
import { PoliceIcon, LowCrimeIcon, WellLitIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon, ExclamationTriangleIcon, FlagIcon } from './icons';

interface RouteDetailsProps {
    routeData: RouteData | null;
    isLoading: boolean;
    error: string | null;
}

const SafetyPointIcon: React.FC<{ type: SafetyPoint['type'] }> = ({ type }) => {
    const iconProps = { className: "w-6 h-6" };
    switch (type) {
        case 'police_presence': return <div className="text-blue-400"><PoliceIcon {...iconProps} /></div>;
        case 'low_crime_zone': return <div className="text-green-400"><LowCrimeIcon {...iconProps} /></div>;
        case 'well_lit': return <div className="text-yellow-400"><WellLitIcon {...iconProps} /></div>;
        default: return null;
    }
};

const TrendIcon: React.FC<{ trend: SafetyPoint['historicalTrend'] }> = ({ trend }) => {
    const iconProps = { className: "w-4 h-4" };
     switch (trend) {
        case 'Improving': return <div className="text-green-400"><ArrowTrendingUpIcon {...iconProps} /></div>;
        case 'Stable': return <div className="text-gray-400"><MinusIcon {...iconProps} /></div>;
        case 'Declining': return <div className="text-red-400"><ArrowTrendingDownIcon {...iconProps} /></div>;
        default: return null;
    }
};

const ReportForm: React.FC<{ onReport: (type: 'safety' | 'road', description: string) => void, onCancel: () => void }> = ({ onReport, onCancel }) => {
    const [type, setType] = useState<'safety' | 'road'>('safety');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(description.trim()){
            onReport(type, description);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 p-3 bg-gray-900/50 rounded-lg space-y-2 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setType('safety')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${type === 'safety' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Safety Concern</button>
                <button type="button" onClick={() => setType('road')} className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${type === 'road' ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Road Issue</button>
            </div>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the issue..."
                className="w-full bg-gray-700/50 text-white p-2 text-sm rounded-md border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition"
                rows={2}
                required
            />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                <button type="submit" className="px-3 py-1.5 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 transition">Submit</button>
            </div>
        </form>
    );
}

const DirectionStep: React.FC<{ step: RouteStep, index: number, isLast: boolean }> = ({ step, index, isLast }) => {
    const [isReporting, setIsReporting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleReport = (type: 'safety' | 'road', description: string) => {
        const newReport = {
            step: index + 1,
            instruction: step.instruction,
            type,
            description,
            timestamp: new Date().toISOString()
        };

        try {
            const existingReports = JSON.parse(localStorage.getItem('userReports') || '[]');
            existingReports.push(newReport);
            localStorage.setItem('userReports', JSON.stringify(existingReports));
        } catch (e) {
            console.error("Failed to save report to localStorage", e);
        }

        setIsReporting(false);
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    }

    return (
        <li className="relative pl-8 pb-6">
            {!isLast && <div className="absolute left-[13px] top-4 h-full w-0.5 bg-gray-700"></div>}
            <div className="absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-gray-700">
                <span className="font-bold text-xs text-indigo-300">{index + 1}</span>
            </div>
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="font-medium text-gray-200">{step.instruction}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.distance}</p>
                </div>
                {!isReporting && !isSubmitted && (
                     <button onClick={() => setIsReporting(true)} className="flex-shrink-0 text-gray-500 hover:text-indigo-400 transition ml-2 p-1 rounded-full hover:bg-gray-700" title="Report an issue">
                        <FlagIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
            {isReporting && <ReportForm onReport={handleReport} onCancel={() => setIsReporting(false)} />}
            {isSubmitted && <p className="text-xs text-green-400 mt-2 animate-fade-in">Report submitted. Thank you!</p>}
        </li>
    );
};


export const RouteDetails: React.FC<RouteDetailsProps> = ({ routeData, isLoading, error }) => {
    if (isLoading) {
        return (
             <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700/50 flex-grow flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                 <h3 className="text-lg font-semibold">Crafting Your Route...</h3>
                 <p className="text-sm text-gray-400">Our AI is analyzing safety data and road conditions to find you the best path.</p>
             </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700/50 flex-grow text-red-400">
                <h3 className="font-bold mb-2">Error</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!routeData) {
        return (
            <div className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700/50 flex-grow flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-500 mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <h3 className="text-lg font-semibold">Ready to Go?</h3>
                 <p className="text-sm text-gray-400">Fill in your journey details above.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 flex-grow flex flex-col overflow-hidden">
             <h3 className="text-lg font-bold p-4 border-b border-gray-700/50 flex-shrink-0 text-white">Route Details</h3>
            <div className="flex-grow overflow-y-auto p-4 space-y-6">
                 <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                    <p className="font-semibold text-indigo-300 text-sm mb-1">Overview</p>
                    <p className="text-sm">{routeData.overview}</p>
                </div>
            
                {routeData.safetyPoints && routeData.safetyPoints.length > 0 && (
                    <div>
                        <h4 className="text-base font-semibold mb-3 text-indigo-300">Safety Insights</h4>
                        <ul className="space-y-3">
                            {routeData.safetyPoints.map((point, index) => (
                                <li key={index} className="p-3 bg-gray-900/50 rounded-lg text-sm border border-gray-700/50">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 pt-0.5">
                                            <SafetyPointIcon type={point.type} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-200 capitalize">{point.type.replace(/_/g, ' ')}</p>
                                            <p className="text-gray-400 text-xs">{point.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                {point.historicalTrend && (
                                                    <span className={`flex items-center gap-1.5 ${
                                                        point.historicalTrend === 'Improving' ? 'text-green-400' : 
                                                        point.historicalTrend === 'Declining' ? 'text-red-400' : ''
                                                    }`}>
                                                        <TrendIcon trend={point.historicalTrend} />
                                                        <span>{point.historicalTrend} Trend</span>
                                                    </span>
                                                )}
                                                {(point.userReports ?? 0) > 0 && (
                                                    <span className="flex items-center gap-1.5 text-yellow-400">
                                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                                        <span>{point.userReports} recent report(s)</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <h4 className="text-base font-semibold mb-3 text-indigo-300">Directions</h4>
                     <ul className="list-none">
                        {routeData.steps.map((step, index) => (
                           <DirectionStep
                                key={index}
                                step={step}
                                index={index}
                                isLast={index === routeData.steps.length - 1}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};