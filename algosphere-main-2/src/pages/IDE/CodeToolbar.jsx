import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';

/**
 * CodeToolbar - Top toolbar for code editor with language selector and settings
 */
const CodeToolbar = ({ selectedLanguage, onLanguageChange, languages = [] }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const currentLanguage = languages.find(lang => lang.id === selectedLanguage) || languages[0] || { name: 'Select Language' };

    const handleLanguageSelect = (langId) => {
        if (onLanguageChange) {
            onLanguageChange(langId);
        }
        setIsDropdownOpen(false);
    };

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-700 w-full shrink-0">
            {/* Left Section: Logo + Language */}
            <div className="flex items-center gap-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                        <span className="text-neutral-900 font-bold text-xs">A</span>
                    </div>
                    <span className="font-semibold text-white hidden sm:block">AlgoSphere</span>
                </div>

                <div className="h-4 w-px bg-neutral-700 hidden sm:block"></div>

                {/* Language Selector */}
                <div className="flex items-center gap-2 relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-sm transition-colors border border-neutral-700"
                    >
                        <span className="font-medium">{currentLanguage.name}</span>
                        <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsDropdownOpen(false)}
                            ></div>

                            {/* Dropdown */}
                            <div className="absolute top-full left-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl z-20 py-1 max-h-80 overflow-y-auto">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.id}
                                        onClick={() => handleLanguageSelect(lang.id)}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${lang.id === selectedLanguage
                                            ? 'bg-neutral-700 text-white font-medium'
                                            : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                                            }`}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                        <span className="text-xs">Auto</span>
                    </button>
                </div>
            </div>

            {/* Right Section: Settings */}
            <div className="flex items-center gap-2">
                <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors">
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
};

export default CodeToolbar;
