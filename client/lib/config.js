// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8088";

// Debug logging
console.log('🔧 Environment Debug Info:');
console.log('Environment Mode:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,

  // Items endpoints
  ITEMS: `${API_BASE_URL}/api/items`,

  // User endpoints
  PROFILE: `${API_BASE_URL}/api/user/profile`,
};

// Default configurations
export const DEFAULT_IMAGE_URL =
  "https://via.placeholder.com/400x300?text=No+Image";
