import { createMockRequest } from '../mocks/data';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false'; // Default to true

/**
 * Simulated network delay for realistic mock behavior
 */
function delay(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generic fetch wrapper with mock support
 */
async function request(endpoint, options = {}) {
  // Mock mode interceptor
  if (USE_MOCKS) {
    await delay();
    return handleMockRequest(endpoint, options);
  }

  // Real API mode
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status !== 204) {
      return await response.json();
    }
    return null;

  } catch (error) {
    console.error('API Request Failed:', error);
    throw error;
  }
}

/**
 * Mock request handler
 */
function handleMockRequest(endpoint, options) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : null;

  // POST /request - Submit assistance request
  if (method === 'POST' && endpoint === '/request') {
    const mockResponse = createMockRequest(
      body.text,
      body.lat,
      body.lon
    );

    return {
      message: 'Help is on the way',
      priority: mockResponse.priority,
      eta_minutes: mockResponse.eta_minutes,
      mechanic_id: mockResponse.mechanic_id,
      request_id: mockResponse.id,
      mechanic: mockResponse.mechanic
    };
  }

  // POST /mechanic/location - Update mechanic position
  if (method === 'POST' && endpoint === '/mechanic/location') {
    return {
      success: true,
      message: 'Location updated',
      updated_at: new Date().toISOString()
    };
  }

  // GET /status/:id - Get request status
  if (method === 'GET' && endpoint.startsWith('/status/')) {
    return {
      status: 'on_the_way',
      distance_meters: 1200,
      eta_minutes: 8,
      last_updated: new Date().toISOString()
    };
  }

  // Fallback
  console.warn(`Mock handler not found for: ${method} ${endpoint}`);
  return { error: 'Not implemented in mock mode' };
}

export const api = {
  /**
   * Submit emergency assistance request
   */
  requestAssistance: (data) => request('/request', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  /**
   * Update mechanic location
   */
  updateMechanicLocation: (data) => request('/mechanic/location', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  /**
   * Get request status
   */
  getStatus: (requestId) => request(`/status/${requestId}`, {
    method: 'GET'
  }),

  /**
   * Generic methods for future endpoints
   */
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  put: (endpoint, data) => request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

