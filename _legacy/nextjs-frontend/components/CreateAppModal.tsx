import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AppDefinition } from '../types';
import IconPicker from './IconPicker';
import IconRenderer from './IconRenderer';

interface CreateAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (app: AppDefinition) => void;
}

const CreateAppModal: React.FC<CreateAppModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instruction, setInstruction] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [showIconPicker, setShowIconPicker] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !instruction) return;

    const newApp: AppDefinition = {
      id: `user-${Date.now()}`,
      name,
      description,
      systemInstruction: instruction,
      icon,
      isSystem: false,
      category: 'general'
    };

    onCreate(newApp);
    onClose();
    // Reset form
    setName('');
    setDescription('');
    setInstruction('');
    setIcon('Sparkles');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Create New Applet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center text-blue-400 hover:border-blue-500 hover:bg-gray-750 transition-all shadow-inner"
              >
                <IconRenderer name={icon} size={32} />
              </button>

              {showIconPicker && (
                <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50">
                  <IconPicker
                    currentIcon={icon}
                    onSelect={setIcon}
                    onClose={() => setShowIconPicker(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Math Tutor"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-700 transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this applet do?"
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-700 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions (System Prompt)</label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="How should the AI behave? e.g. 'You are a sarcastic math teacher...'"
              className="w-full h-32 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-700 resize-none transition-all font-medium leading-relaxed"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
            >
              Create Applet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppModal;