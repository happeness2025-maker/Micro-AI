export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

export interface User {
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
  lastLogin?: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  AI_STUDIO = 'AI_STUDIO',
  PRODUCTION_TOOLS = 'PRODUCTION_TOOLS',
  ADMIN_DB = 'ADMIN_DB',
}

export enum AIToolType {
  // Creator Tools
  VIDEO_IDEATION = 'Viral Video Ideation',
  VIDEO_SCRIPT_GENERATOR = 'Video Script Generator', // NEW: Full Script Creation
  SCRIPT_POLISHER = 'Script Polisher',
  VISUAL_PROMPT = 'Visual Prompt Generator', // Midjourney/Stable Diffusion
  META_PROMPT_GENERATOR = 'AI System Prompt Creator', // New: Create prompts for other AIs
  VISUAL_DESIGN_EXPERT = 'Visual Design Architect', // NEW: The requested Super Designer
  
  // Distribution Tools
  REPURPOSE_CONTENT = 'Content Repurposing', // The requested specific feature
  YOUTUBE_SEO = 'YouTube SEO',
  THUMBNAIL_CONCEPT = 'Thumbnail Art Director',
  SOCIAL_MANAGER = 'Social Media Manager',
  
  // Business Tools
  SPONSOR_PITCH = 'Sponsorship Pitch Writer',
  COMMUNITY_ENGAGEMENT = 'Community Manager',
  EMAIL_NEWSLETTER = 'Newsletter Generator'
}

export interface SheetUserRow {
  username: string;
  password: string; // In a real app, never handle plain text passwords client side!
  role: string;
  status: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  uv: number;
}

export interface HistoryItem {
  id: string;
  tool: AIToolType;
  input: string;
  output: string;
  timestamp: Date;
}