import React, { useState, useEffect } from 'react';
import { AIToolType, HistoryItem } from '../types';
import { generateAIContent } from '../services/geminiService';
import { 
  Sparkles, Copy, Loader2, Send, Lightbulb, Image as ImageIcon, Briefcase, 
  Repeat, Users, Mail, Youtube, FileText, Cpu, PenTool, Check, Info, 
  Palette, History, Trash2, Video, Wand2, Minimize2, Maximize2, Coffee, CheckCircle 
} from 'lucide-react';

const getToolIcon = (tool: AIToolType) => {
  switch (tool) {
    case AIToolType.VISUAL_DESIGN_EXPERT: return <Palette className="w-4 h-4" />;
    case AIToolType.VISUAL_PROMPT: return <ImageIcon className="w-4 h-4" />;
    case AIToolType.VIDEO_IDEATION: return <Lightbulb className="w-4 h-4" />;
    case AIToolType.VIDEO_SCRIPT_GENERATOR: return <Video className="w-4 h-4" />;
    case AIToolType.REPURPOSE_CONTENT: return <Repeat className="w-4 h-4" />;
    case AIToolType.META_PROMPT_GENERATOR: return <Cpu className="w-4 h-4" />;
    case AIToolType.SCRIPT_POLISHER: return <FileText className="w-4 h-4" />;
    case AIToolType.YOUTUBE_SEO: return <Youtube className="w-4 h-4" />;
    case AIToolType.THUMBNAIL_CONCEPT: return <ImageIcon className="w-4 h-4" />;
    case AIToolType.SPONSOR_PITCH: return <Briefcase className="w-4 h-4" />;
    case AIToolType.COMMUNITY_ENGAGEMENT: return <Users className="w-4 h-4" />;
    case AIToolType.EMAIL_NEWSLETTER: return <Mail className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getToolDescription = (tool: AIToolType) => {
  switch (tool) {
    case AIToolType.VISUAL_DESIGN_EXPERT: return "The ultimate design architect. Creates professional-grade concepts for Photos, Logos, UI/UX, 3D Renders, and more. Outputs Standard, Premium, and Luxury variations with ready-to-use prompts.";
    case AIToolType.VISUAL_PROMPT: return "Generates highly detailed, photorealistic image prompts optimized for Midjourney v6 and Stable Diffusion XL. Focuses on lighting, camera gear, and composition.";
    case AIToolType.VIDEO_IDEATION: return "Brainstorms viral video concepts based on your niche. Provides catchy titles, strong hooks, and payoff structures to maximize retention.";
    case AIToolType.VIDEO_SCRIPT_GENERATOR: return "Transforms topics into full video scripts. Generates a structured plan with Hooks, Intros, Body Content, Outros, and specific B-Roll visual suggestions.";
    case AIToolType.REPURPOSE_CONTENT: return "Transforms your existing scripts, transcripts, or notes into multi-platform social media content (Twitter threads, LinkedIn posts, and Carousel outlines).";
    case AIToolType.META_PROMPT_GENERATOR: return "Creates robust system instructions (personas) for other AI agents. Use this to build your own custom AI bots with specific personalities and constraints.";
    case AIToolType.SCRIPT_POLISHER: return "Refines rough drafts into professional scripts. It automatically offers three variations: Professional, Viral/Fast-Paced, and Emotional.";
    case AIToolType.YOUTUBE_SEO: return "Optimizes video metadata. Generates high-CTR titles, engaging descriptions with timestamps, and a strategic tag list for better search ranking.";
    case AIToolType.THUMBNAIL_CONCEPT: return "Describes high-converting thumbnail visuals. Details the subject expression, background elements, and text overlays to give to a designer.";
    case AIToolType.SPONSOR_PITCH: return "Drafts personalized, persuasive outreach emails to potential brand partners. Focuses on audience demographics and creative integration ideas.";
    case AIToolType.COMMUNITY_ENGAGEMENT: return "Generates empathetic or witty responses to user comments to boost engagement. Also suggests relevant community polls.";
    case AIToolType.EMAIL_NEWSLETTER: return "Converts updates or topics into engaging newsletter segments in the style of top tech/business digests (e.g., Morning Brew).";
    default: return "Select a tool to get started.";
  }
};

const getPlaceholder = (tool: AIToolType) => {
  switch (tool) {
    case AIToolType.VISUAL_DESIGN_EXPERT: return "Enter: Concept – Style – Colors – Size – Platform (e.g., 'Coffee Shop App UI - Minimalist - Beige/Green - Mobile - Figma')...";
    case AIToolType.VISUAL_PROMPT: return "Describe your image concept (e.g., 'A cyberpunk cat eating ramen in Tokyo')...";
    case AIToolType.META_PROMPT_GENERATOR: return "Describe the AI persona you want to build (e.g., 'A Python coding tutor that speaks in pirate riddles')...";
    case AIToolType.REPURPOSE_CONTENT: return "Paste your video script, transcript, or blog post here to convert it into social content...";
    case AIToolType.SCRIPT_POLISHER: return "Paste your rough script or notes here...";
    case AIToolType.VIDEO_IDEATION: return "Enter your channel niche (e.g., 'Tech Reviews', 'Gardening', 'True Crime')...";
    case AIToolType.VIDEO_SCRIPT_GENERATOR: return "Enter video topic, target audience, and length (e.g., 'How to Bake Sourdough for Beginners, 10 minutes')...";
    case AIToolType.THUMBNAIL_CONCEPT: return "Enter your video title and the main emotion you want to convey...";
    case AIToolType.SPONSOR_PITCH: return "Enter the Brand Name, Product Name, and your specific Niche...";
    default: return "Enter input context...";
  }
};

const getSmartChips = (tool: AIToolType) => {
    switch (tool) {
        case AIToolType.VISUAL_DESIGN_EXPERT:
            return ["Photo Generation", "Logo Design", "UI/UX Figma", "3D Render", "Social Media Post", "Business Card", "Luxury Style", "Minimalist"];
        case AIToolType.VISUAL_PROMPT:
            return ["Cinematic Lighting", "Photorealistic", "Cyberpunk Style", "Studio Ghibli Style", "8k Resolution", "Wide Angle"];
        case AIToolType.REPURPOSE_CONTENT:
            return ["Make it Punchy", "Focus on Statistics", "Use Humorous Tone", "Professional Tone", "Add Emojis", "Summarize First"];
        case AIToolType.SCRIPT_POLISHER:
            return ["Make it Funnier", "Shorten sentences", "Add Dramatic Pauses", "Sound more Professional"];
        case AIToolType.VIDEO_SCRIPT_GENERATOR:
            return ["Tutorial Style", "Vlog Style", "Documentary", "Fast Paced", "Storytelling Focus", "Educational"];
        case AIToolType.YOUTUBE_SEO:
            return ["High CTR", "Clickbait (Moderate)", "Curiosity Gap", "Keyword Heavy"];
        case AIToolType.META_PROMPT_GENERATOR:
            return ["Strict Constraints", "Friendly Tone", "Step-by-Step Logic", "Code Expert"];
        default:
            return [];
    }
};

const getRefineOptions = () => [
  { label: "Shorten", icon: <Minimize2 className="w-3 h-3" /> },
  { label: "Expand", icon: <Maximize2 className="w-3 h-3" /> },
  { label: "Professional", icon: <Briefcase className="w-3 h-3" /> },
  { label: "Casual", icon: <Coffee className="w-3 h-3" /> },
  { label: "Fix Grammar", icon: <CheckCircle className="w-3 h-3" /> },
];

const AITools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<AIToolType>(AIToolType.VISUAL_DESIGN_EXPERT);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('micro_ai_history');
    if (savedHistory) {
      try {
        // Need to convert date strings back to Date objects
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
        }));
        setHistory(parsed);
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('micro_ai_history', JSON.stringify(history));
    }
  }, [history]);

  const handleGenerate = async (overrideInput?: string) => {
    const textToProcess = overrideInput || input;
    if (!textToProcess.trim()) return;

    setLoading(true);
    if (!overrideInput) setOutput(''); // Clear output only if new generation
    
    try {
      const result = await generateAIContent(selectedTool, textToProcess);
      setOutput(result);
      
      // Save to History (only for main generations, not refinements unless we want to)
      if (!overrideInput) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          tool: selectedTool,
          input: textToProcess,
          output: result,
          timestamp: new Date()
        };
        setHistory(prev => [newItem, ...prev]);
      }

    } catch (error) {
      setOutput("Error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = (action: string) => {
    if (!output) return;
    const refinePrompt = `Here is the content you generated previously:\n"${output}"\n\nTASK: Please rewrite the content above to: ${action}. Maintain the original formatting where possible.`;
    handleGenerate(refinePrompt);
  };

  const addChipToInput = (chipText: string) => {
    if (!input.trim()) {
        setInput(`${chipText}`);
    } else {
        setInput(prev => `${prev} - ${chipText}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setSelectedTool(item.tool);
    setInput(item.input);
    setOutput(item.output);
    setShowHistory(false); // Close history view
  };

  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem('micro_ai_history');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in h-[calc(100vh-140px)]">
      {/* Sidebar / Tool Selection - Enhanced Glass Container */}
      <div className="lg:col-span-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-4 flex flex-col gap-2 shadow-2xl overflow-hidden ring-1 ring-black/5">
        
        {/* Sidebar Tabs */}
        <div className="flex gap-2 mb-2 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
             <button 
                onClick={() => setShowHistory(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${!showHistory ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-white transform scale-105' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Sparkles className="w-4 h-4" /> Tools
             </button>
             <button 
                onClick={() => setShowHistory(true)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${showHistory ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-white transform scale-105' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <History className="w-4 h-4" /> History
             </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
          {!showHistory ? (
             Object.values(AIToolType).map((tool) => (
                <button
                  key={tool}
                  onClick={() => {
                    setSelectedTool(tool);
                    setInput('');
                    setOutput('');
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-3 text-sm border border-transparent ${
                    selectedTool === tool
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {getToolIcon(tool)}
                  <span className="truncate">{tool}</span>
                </button>
              ))
          ) : (
              history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center px-4">
                      <History className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No recent generations.</p>
                  </div>
              ) : (
                  <>
                  {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => restoreHistoryItem(item)}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0 group"
                      >
                          <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-bold text-indigo-500 flex items-center gap-1">
                                  {getToolIcon(item.tool)} {item.tool}
                              </span>
                              <span className="text-[10px] text-gray-400">{item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{item.input}</p>
                      </button>
                  ))}
                  <button onClick={clearHistory} className="w-full mt-4 text-xs text-red-500 hover:text-red-600 flex items-center justify-center gap-1 py-2 font-semibold">
                      <Trash2 className="w-3 h-3" /> Clear History
                  </button>
                  </>
              )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        
        {/* Input Section - Enhanced Glass Container */}
        <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 shadow-2xl flex-shrink-0 transition-all duration-300 ring-1 ring-black/5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
               <PenTool className="w-4 h-4 text-indigo-500" />
               <span>Input Context</span>
            </label>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 shadow-sm">
               {selectedTool}
            </span>
          </div>

          {/* Tool Description Info Box */}
          <div className="mb-4 bg-indigo-50/80 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/30 flex gap-3 items-start shadow-sm">
             <Info className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
             <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                 {getToolDescription(selectedTool)}
             </p>
          </div>

          {/* Smart Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
             {getSmartChips(selectedTool).map((chip, idx) => (
                 <button 
                    key={idx}
                    onClick={() => addChipToInput(chip)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                 >
                    + {chip}
                 </button>
             ))}
          </div>

          <div className="relative group">
            <textarea
              className="w-full h-40 bg-white dark:bg-black/40 border border-gray-200 dark:border-gray-600 rounded-2xl p-4 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-mono text-sm shadow-inner"
              placeholder={getPlaceholder(selectedTool)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={loading || !input.trim()}
              className="absolute bottom-4 right-4 bg-gray-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl flex items-center gap-2 font-bold text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? 'Thinking...' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Output Section - Enhanced Glass Container */}
        <div className="flex-grow bg-white/60 dark:bg-black/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-0 ring-1 ring-black/5">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" /> Gemini Output
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 text-xs bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-full transition-colors text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-bold min-w-[120px] justify-center"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy All Output'}
              </button>
            )}
          </div>
          
          <div className="flex-grow overflow-y-auto bg-white/50 dark:bg-black/20 rounded-2xl p-6 border border-white/10 shadow-inner custom-scrollbar relative">
             {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-4 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-10">
                   <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-gray-700 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                   </div>
                   <p className="animate-pulse font-medium text-indigo-500 bg-white/80 dark:bg-black/80 px-4 py-1 rounded-full shadow-lg">Creating brilliance...</p>
                </div>
             ) : output ? (
               <div className="flex flex-col gap-4">
                 <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-sm text-gray-800 dark:text-gray-200 font-medium">
                   {output}
                 </div>
                 
                 {/* Magic Refine Toolbar */}
                 <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> Magic Refine Output
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {getRefineOptions().map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleRefine(opt.label)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:shadow-md"
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                 </div>
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                 <div className="bg-gray-200 dark:bg-gray-800 p-5 rounded-full mb-3 shadow-inner">
                    <Sparkles className="w-8 h-8 text-gray-500" />
                 </div>
                 <p className="font-bold text-lg">Ready to create.</p>
                 <p className="text-sm">Select a tool, add magic chips, and hit generate.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;