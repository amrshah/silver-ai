import React from 'react';
import { Play } from 'lucide-react';
import { AppDefinition } from '../types';
import IconRenderer from './IconRenderer';

interface AppCardProps {
  app: AppDefinition;
  onSelect: (app: AppDefinition) => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onSelect }) => {
  return (
    <div className="group relative flex flex-col p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-800 border border-gray-700 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-600/30 transition-all duration-300 shadow-inner">
          <IconRenderer name={app.icon || 'Sparkles'} size={28} />
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(app);
            }}
            className="p-3 bg-blue-600 rounded-xl text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          >
            <Play size={18} fill="currentColor" />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{app.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed font-medium">
        {app.description}
      </p>

      {app.isSystem && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-400 bg-blue-400/10 px-2 py-1 rounded border border-blue-400/20">
            Official
          </span>
        </div>
      )}
    </div>
  );
};

export default AppCard;