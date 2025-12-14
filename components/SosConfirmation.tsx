import React, { useState } from 'react';
import { CheckCircleIcon, WhatsAppIcon, MessageIcon } from './icons';

interface SosConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    location: { lat: number; lng: number };
}

export const SosConfirmation: React.FC<SosConfirmationProps> = ({ isOpen, onClose, location }) => {
    const [phoneNumber, setPhoneNumber] = useState('+91 ');
    const [isTrackerSent, setIsTrackerSent] = useState(false);
    const [sentMethod, setSentMethod] = useState<'WhatsApp' | 'Message' | null>(null);
    
    if (!isOpen) return null;

    const handleShare = (method: 'whatsapp' | 'sms') => {
        if (phoneNumber.trim().length > 4) {
            const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
            const trackingUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
            const message = encodeURIComponent(
                `Emergency! I've activated an SOS alert from AstraPath. My current location is approximately ${location.lat}, ${location.lng}. Please track my location here: ${trackingUrl}`
            );

            let shareUrl = '';
            if (method === 'whatsapp') {
                shareUrl = `https://wa.me/${cleanPhoneNumber}?text=${message}`;
                setSentMethod('WhatsApp');
            } else { // sms
                shareUrl = `sms:${cleanPhoneNumber}?body=${message}`;
                setSentMethod('Message');
            }

            window.open(shareUrl, '_blank');
            setIsTrackerSent(true);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.startsWith('+91 ') && /^\+91 \d*$/.test(value)) {
            setPhoneNumber(value);
        } else if (value === '+91' || value === '+9' || value === '+') {
            setPhoneNumber('+91 ');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4" aria-modal="true" role="dialog">
             <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md text-center p-8 animate-fade-in">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Alert Sent</h3>
                <p className="text-gray-300 mb-6">
                    Help is on the way. Your location has been shared with local authorities. Stay safe.
                </p>

                <div className="border-t border-gray-700 my-6"></div>

                {!isTrackerSent ? (
                    <>
                        <h4 className="text-lg font-semibold text-white mb-3">Share Live Location</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Send a live tracking link to an emergency contact.
                        </p>
                        <div className="space-y-3">
                             <input
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneChange}
                                placeholder="+91 Enter phone number"
                                className="w-full bg-gray-700/50 text-white p-3 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition text-center"
                            />
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleShare('whatsapp')}
                                    className="w-full flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DAE54] text-white font-bold p-3 rounded-lg transition-colors duration-200"
                                >
                                    <WhatsAppIcon className="w-5 h-5" />
                                    <span>WhatsApp</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleShare('sms')}
                                    className="w-full flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg transition-colors duration-200"
                                >
                                    <MessageIcon className="w-5 h-5" />
                                    <span>Message</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                        <p className="font-semibold text-green-400">Sharing Initiated!</p>
                        <p className="text-sm text-gray-300">Your browser has been prompted to share a tracking link with {phoneNumber} via {sentMethod}.</p>
                    </div>
                )}

                <button
                    type="button"
                    className="w-full rounded-md bg-gray-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors mt-8"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};