import React, { useState } from 'react';
import { Clock, Calculator, Clapperboard, Film } from 'lucide-react';

const ProductionTools: React.FC = () => {
  const [wordCount, setWordCount] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(150); // Average speaking rate
  
  const calculateTime = () => {
    const minutes = wordCount / wpm;
    const m = Math.floor(minutes);
    const s = Math.floor((minutes - m) * 60);
    return `${m}m ${s}s`;
  };

  const scenes = [
      { id: 12, name: 'Int. Office - Day', shots: 4, status: 'To Do' },
      { id: 13, name: 'Ext. Park - Day', shots: 2, status: 'In Progress' },
      { id: 14, name: 'Int. Car - Night', shots: 6, status: 'Done' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        {/* Script Timer */}
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> Script Timer
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Total Words</label>
                    <input 
                        type="number" 
                        value={wordCount}
                        onChange={(e) => setWordCount(Number(e.target.value))}
                        className="w-full bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-1">Speaking Rate (WPM)</label>
                    <input 
                        type="number" 
                        value={wpm}
                        onChange={(e) => setWpm(Number(e.target.value))}
                        className="w-full bg-white/50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-lg p-2"
                    />
                </div>
                <div className="bg-indigo-500/10 p-4 rounded-xl text-center">
                    <span className="text-sm text-indigo-600 dark:text-indigo-300">Estimated Duration</span>
                    <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{calculateTime()}</p>
                </div>
            </div>
        </div>

        {/* Aspect Ratio Calc (Visual Only for Demo) */}
        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-pink-500" /> Resolution Matcher
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-pink-500 relative">
                    <span className="text-xs absolute top-2 left-2">16:9</span>
                    <span className="font-mono text-sm">1920x1080</span>
                </div>
                <div className="aspect-[9/16] bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400 relative">
                     <span className="text-xs absolute top-2 left-2">9:16</span>
                    <span className="font-mono text-sm">1080x1920</span>
                </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">Visualizer for YouTube vs TikTok framing.</p>
        </div>

        {/* Scene Manager */}
        <div className="md:col-span-2 bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-gray-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-green-500" /> Scene Manager
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenes.map(scene => (
                    <div key={scene.id} className="bg-white/50 dark:bg-black/50 p-4 rounded-xl border border-white/10 flex justify-between items-center group cursor-pointer hover:bg-white/70 dark:hover:bg-black/70 transition-colors">
                        <div>
                            <span className="text-xs font-bold text-gray-400">SCENE {scene.id}</span>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{scene.name}</h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <Film className="w-3 h-3" /> {scene.shots} Shots
                            </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold 
                            ${scene.status === 'Done' ? 'bg-green-100 text-green-700' : 
                              scene.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>
                            {scene.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ProductionTools;