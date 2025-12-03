import { SheetUserRow, UserRole } from "../types";

// The Google Sheet URL provided, converted to CSV format for direct parsing
const LIVE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGAIfCFRoDy98jQbbyvttdh0OtTJsLY-Scyt_7SODC1Wq_31JBP6JPbYL6yWG73zhebkdcylKgpg5a/pub?output=csv";
const LOCAL_STORAGE_USERS_KEY = 'micro_ai_local_users';

// HARDCODED CRITICAL USERS (Always available)
const SYSTEM_USERS: SheetUserRow[] = [
  { username: 'micro', password: 'Micro@=1', role: 'admin', status: 'active' }, // The requested Admin
  { username: 'admin', password: 'password123', role: 'admin', status: 'active' } // Fallback
];

// SIMULATED DATABASE (Fallback)
const MOCK_SHEET_DATA = `User,Pass,Role,Status
viewer,viewer123,viewer,active
guest,guest123,guest,active
creator_lead,design2024,viewer,active`;

export const registerUser = (username: string, pass: string): boolean => {
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const localUsers: SheetUserRow[] = existingStr ? JSON.parse(existingStr) : [];
    
    // Check if user exists
    if (localUsers.find(u => u.username === username) || SYSTEM_USERS.find(u => u.username === username)) {
      return false; // User exists
    }

    const newUser: SheetUserRow = {
      username,
      password: pass,
      role: 'viewer', // Default role for new signups
      status: 'active'
    };

    localUsers.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(localUsers));
    return true;
  } catch (e) {
    console.error("Registration failed", e);
    return false;
  }
};

export const parseSheetData = async (sheetUrl: string = LIVE_SHEET_URL): Promise<SheetUserRow[]> => {
  let allUsers: SheetUserRow[] = [...SYSTEM_USERS];

  // 1. Get Local Storage Users (Registered via App)
  try {
    const localStr = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (localStr) {
      const localUsers = JSON.parse(localStr);
      allUsers = [...allUsers, ...localUsers];
    }
  } catch (e) {
    console.warn("Failed to load local users");
  }

  // 2. Fetch Live Google Sheet Data
  if (sheetUrl && sheetUrl.startsWith('http')) {
    try {
        const urlWithCacheBuster = `${sheetUrl}&t=${Date.now()}`;
        const response = await fetch(urlWithCacheBuster);
        
        if (response.ok) {
            const csvText = await response.text();
            const sheetUsers = parseCSV(csvText);
            allUsers = [...allUsers, ...sheetUsers];
            console.log("Synced with Live Sheet.");
        } else {
            console.warn("Live Sheet fetch failed, using internal mock data.");
            const mockUsers = parseCSV(MOCK_SHEET_DATA);
            allUsers = [...allUsers, ...mockUsers];
        }
    } catch (e) {
        console.warn("Network error, using internal mock data.");
        const mockUsers = parseCSV(MOCK_SHEET_DATA);
        allUsers = [...allUsers, ...mockUsers];
    }
  }

  return allUsers;
};

// Helper to parse CSV text
const parseCSV = (text: string): SheetUserRow[] => {
  const lines = text.replace(/\r/g, '').trim().split('\n');
  const users: SheetUserRow[] = [];

  // Skip header (i=1)
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length >= 2) { // Minimal validation
      users.push({
        username: currentLine[0].trim(),
        password: currentLine[1].trim(),
        role: currentLine[2]?.trim() || 'viewer',
        status: currentLine[3]?.trim() || 'active',
      });
    }
  }
  return users;
};

export const mapRole = (roleStr: string): UserRole => {
  const normalizedRole = roleStr ? roleStr.toLowerCase().trim() : '';
  switch (normalizedRole) {
    case 'admin': return UserRole.ADMIN;
    case 'viewer': return UserRole.VIEWER;
    case 'guest': return UserRole.GUEST;
    default: return UserRole.VIEWER;
  }
};