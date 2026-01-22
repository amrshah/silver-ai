import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import IconRenderer from './IconRenderer';

const AVAILABLE_ICONS = [
    'Sparkles', 'Code', 'PenTool', 'FileText', 'Smile', 'Cpu', 'Brain',
    'Globe', 'Database', 'Music', 'Video', 'Camera', 'Layout', 'Settings',
    'MessageSquare', 'Zap', 'Shield', 'HardDrive', 'Layers', 'Box'
];

interface IconPickerProps {
    currentIcon: string;
    onSelect: (icon: string) => void;
    onClose: () => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ currentIcon, onSelect, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = AVAILABLE_ICONS.filter(icon =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 w-72">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Select Icon</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>

            <div className="relative mb-4">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {filteredIcons.map(icon => (
                    <button
                        key={icon}
                        onClick={() => {
                            onSelect(icon);
                            onClose();
                        }}
                        className={`
              flex items-center justify-center p-3 rounded-lg border transition-all
              ${currentIcon === icon
                                ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750 hover:border-gray-600'}
            `}
                        title={icon}
                    >
                        <IconRenderer name={icon} size={20} />
                    </button>
                ))}
                {filteredIcons.length === 0 && (
                    <div className="col-span-4 py-4 text-center text-xs text-gray-500">
                        No icons found
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconPicker;
