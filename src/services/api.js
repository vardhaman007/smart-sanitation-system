const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to perform HTTP requests with JSON / Error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers
  };

  // Attach JWT automatically when a staff user is logged in
  const token = localStorage.getItem('sanitation_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if body is NOT FormData
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const offlineError = new Error(
        'Backend API server is offline (http://localhost:5000). Please start the backend.'
      );
      offlineError.isOffline = true;
      throw offlineError;
    }

    throw err;
  }
}

export const api = {
  async checkHealth() {
    return request('/health');
  },

  async getStats(workerId = null) {
    const query = workerId ? `?worker_id=${workerId}` : '';
    return request(`/stats${query}`);
  },

  async getTickets(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
    if (filters.worker_id) params.append('worker_id', filters.worker_id);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/tickets${queryString}`);
  },

  async getTicketById(id) {
    return request(`/tickets/${id}`);
  },

  async createTicket(ticketData, imageFile = null) {
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('issue_type', ticketData.issueType || ticketData.issue_type);
      formData.append('description', ticketData.description);
      formData.append('location', ticketData.location);
      formData.append('priority', ticketData.priority || 'Medium');

      if (ticketData.reportedBy) formData.append('citizen_name', ticketData.reportedBy);
      if (ticketData.citizenPhone) formData.append('citizen_phone', ticketData.citizenPhone);
      if (ticketData.contactEmail) formData.append('citizen_email', ticketData.contactEmail);

      return request('/tickets', {
        method: 'POST',
        body: formData
      });
    }

    return request('/tickets', {
      method: 'POST',
      body: JSON.stringify({
        issue_type: ticketData.issueType || ticketData.issue_type,
        description: ticketData.description,
        location: ticketData.location,
        priority: ticketData.priority || 'Medium',
        citizen_name: ticketData.reportedBy,
        citizen_phone: ticketData.citizenPhone,
        citizen_email: ticketData.contactEmail,
        image_url: ticketData.imageUrl
      })
    });
  },

  async updateTicket(id, updates) {
    return request(`/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  async assignWorker(ticketId, workerId, changedBy = 'Municipal Admin') {
    return request(`/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({
        worker_id: workerId,
        changed_by: changedBy
      })
    });
  },

  async updateTicketStatus(
    ticketId,
    { status, note, resolution_note, changedBy, afterImageFile = null, after_image_url = null }
  ) {
    if (afterImageFile) {
      const formData = new FormData();
      formData.append('after_image', afterImageFile);
      formData.append('status', status);
      formData.append('note', note || resolution_note || '');
      formData.append('resolution_note', resolution_note || note || '');
      formData.append('changed_by', changedBy || 'Worker');

      return request(`/tickets/${ticketId}/status`, {
        method: 'PATCH',
        body: formData
      });
    }

    return request(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        note: note || resolution_note,
        resolution_note: resolution_note || note,
        after_image_url,
        changed_by: changedBy || 'Worker'
      })
    });
  },

  async deleteTicket(id) {
    return request(`/tickets/${id}`, {
      method: 'DELETE'
    });
  },

  async getWorkers() {
    return request('/workers');
  },

  async getWorkerTickets(workerId) {
    return request(`/workers/${workerId}/tickets`);
  },

  async getUsers(role = null) {
    const query = role ? `?role=${role}` : '';
    return request(`/users${query}`);
  },

  async createUser(userData) {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Staff authentication
  async login(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  logout() {
    localStorage.removeItem('sanitation_auth_token');
    localStorage.removeItem('sanitation_user');
  }
};

export default api;
