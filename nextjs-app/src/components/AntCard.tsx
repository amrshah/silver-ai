"use client";

import React from 'react';
import { Play } from 'lucide-react';
import { AntDefinition } from '../types';
import IconRenderer from './IconRenderer';

interface AntCardProps {
    ant: AntDefinition;
    onSelect: (ant: AntDefinition) => void;
}

const AntCard: React.FC<AntCardProps> = ({ ant, onSelect }) => {
    return (
        <div className="group relative flex flex-col p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 overflow-hidden" onClick={() => onSelect(ant)}>
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-[#ea580c] group-hover:scale-110 group-hover:text-white group-hover:bg-[#ea580c] transition-all duration-500 shadow-inner">
                    <IconRenderer name={ant.icon || 'Sparkles'} size={28} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                    <div className="p-3 bg-[#ea580c] rounded-xl text-white shadow-xl shadow-[#ea580c]/20">
                        <Play size={18} fill="currentColor" />
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">{ant.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-medium">
                {ant.description}
            </p>

            {ant.isSystem && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ea580c] bg-[#ea580c]/5 px-2.5 py-1 rounded-full border border-[#ea580c]/10">
                        Proprietary
                    </span>
                </div>
            )}
        </div>
    );
};

export default AntCard;
