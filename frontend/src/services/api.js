// HTTP Client Utility implemented using XMLHttpRequest (XHR)
// Complies strictly with restriction: NO Axios and NO native fetch()

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5000/api';
  }
  return 'https://agriqueue-3-qnqd.onrender.com/api';
};

const BASE_URL = getBaseUrl();

/**
 * Custom XHR HTTP Request Helper
 * @param {string} endpoint - API route path
 * @param {string} method - GET, POST, PUT, PATCH, DELETE
 * @param {object|null} body - Request body data
 * @returns {Promise<any>}
 */
const request = (endpoint, method = 'GET', body = null) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');

    // Attach JWT token from localStorage if present
    const token = localStorage.getItem('agriqueue_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        let responseData = null;
        try {
          responseData = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        } catch (e) {
          responseData = { message: xhr.responseText || 'Server error' };
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(responseData);
        } else {
          const errorMessage = responseData && responseData.message 
            ? responseData.message 
            : `Request failed with status ${xhr.status}`;
          reject(new Error(errorMessage));
        }
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network error: Unable to reach AgriQueue backend server'));
    };

    xhr.ontimeout = function () {
      reject(new Error('Request timeout: Backend server took too long to respond'));
    };

    if (body) {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  });
};

// Export API helper methods
export const api = {
  get: (endpoint) => request(endpoint, 'GET'),
  post: (endpoint, body) => request(endpoint, 'POST', body),
  put: (endpoint, body) => request(endpoint, 'PUT', body),
  patch: (endpoint, body) => request(endpoint, 'PATCH', body)
};

export default api;
