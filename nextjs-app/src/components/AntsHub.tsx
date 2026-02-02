"use client";

import React, { useState } from 'react';
import { AntDefinition } from '../types';
import AntCard from './AntCard';
import CreateAntModal from './CreateAntModal';
import { Plus, Search } from 'lucide-react';

interface AntsHubProps {
    systemAnts: AntDefinition[];
    userAnts: AntDefinition[];
    onAntSelect: (ant: AntDefinition) => void;
    onAntCreate: (ant: AntDefinition) => void;
    isAdmin?: boolean;
}

const AntsHub: React.FC<AntsHubProps> = ({ systemAnts, userAnts, onAntSelect, onAntCreate, isAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filterAnts = (ants: AntDefinition[]) => {
        return ants.filter(ant =>
            ant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ant.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-[#0d1117] p-6 md:p-10 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 md:items-end md:justify-between border-b border-gray-800 pb-10">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold text-white tracking-tight">Ants Hub</h1>
                        <p className="text-gray-400 text-lg font-medium">Discover and create custom AI assistants powered by Silver AI.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search ants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 rounded-2xl bg-gray-950 border border-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-72 md:w-80 shadow-inner group-hover:bg-gray-900 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                </div>

                {/* Section: My Ants (User created) */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white tracking-tight">My Ants</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
                    </div>

                    {filterAnts(userAnts).length === 0 ? (
                        <div className="bg-gray-900/30 border-2 border-dashed border-gray-800 rounded-3xl p-12 text-center group hover:border-blue-600/30 transition-colors">
                            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-600 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                                <Plus size={32} />
                            </div>
                            <p className="text-gray-400 font-medium mb-6">You haven't created any custom ants yet.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2 mx-auto"
                            >
                                Create your first ant
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filterAnts(userAnts).map(ant => (
                                <div key={ant.id} onClick={() => onAntSelect(ant)}>
                                    <AntCard ant={ant} onSelect={onAntSelect} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section: Featured (System) */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Featured Official</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
                        {filterAnts(systemAnts).map(ant => (
                            <div key={ant.id} onClick={() => onAntSelect(ant)}>
                                <AntCard ant={ant} onSelect={onAntSelect} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <CreateAntModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={onAntCreate}
                isAdmin={isAdmin}
            />
        </div>
    );
};

export default AntsHub;
