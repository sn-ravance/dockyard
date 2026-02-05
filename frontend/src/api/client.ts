const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Health
  async getHealth() {
    const response = await fetch(`${API_BASE}/health`);
    return handleResponse(response);
  },

  // System
  async getSystemInfo() {
    const response = await fetch(`${API_BASE}/system/info`);
    return handleResponse(response);
  },

  async getVersion() {
    const response = await fetch(`${API_BASE}/system/version`);
    return handleResponse(response);
  },

  // Containers
  async getContainers(all = true) {
    const response = await fetch(`${API_BASE}/containers?all=${all}`);
    return handleResponse(response);
  },

  async getContainer(id: string) {
    const response = await fetch(`${API_BASE}/containers/${id}`);
    return handleResponse(response);
  },

  async startContainer(id: string) {
    const response = await fetch(`${API_BASE}/containers/${id}/start`, { method: 'POST' });
    return handleResponse(response);
  },

  async stopContainer(id: string) {
    const response = await fetch(`${API_BASE}/containers/${id}/stop`, { method: 'POST' });
    return handleResponse(response);
  },

  async restartContainer(id: string) {
    const response = await fetch(`${API_BASE}/containers/${id}/restart`, { method: 'POST' });
    return handleResponse(response);
  },

  async killContainer(id: string) {
    const response = await fetch(`${API_BASE}/containers/${id}/kill`, { method: 'POST' });
    return handleResponse(response);
  },

  async removeContainer(id: string, force = false) {
    const response = await fetch(`${API_BASE}/containers/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    return handleResponse(response);
  },

  async getContainerLogs(id: string, tail = 100) {
    const response = await fetch(`${API_BASE}/containers/${id}/logs?tail=${tail}`);
    return handleResponse<{ logs: string }>(response);
  },

  // Images
  async getImages() {
    const response = await fetch(`${API_BASE}/images`);
    return handleResponse(response);
  },

  async getImage(id: string) {
    const response = await fetch(`${API_BASE}/images/${id}`);
    return handleResponse(response);
  },

  async pullImage(image: string, onProgress: (progress: unknown) => void) {
    const response = await fetch(`${API_BASE}/images/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to pull image' }));
      throw new Error(error.error);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onProgress(data);
          } catch {
            // Ignore parse errors
          }
        }
      }
    }
  },

  async removeImage(id: string, force = false) {
    const response = await fetch(`${API_BASE}/images/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    return handleResponse(response);
  },

  async pruneImages() {
    const response = await fetch(`${API_BASE}/images/prune`, { method: 'POST' });
    return handleResponse(response);
  },

  // Volumes
  async getVolumes() {
    const response = await fetch(`${API_BASE}/volumes`);
    return handleResponse(response);
  },

  async getVolume(name: string) {
    const response = await fetch(`${API_BASE}/volumes/${name}`);
    return handleResponse(response);
  },

  async createVolume(name: string, options?: { driver?: string; labels?: Record<string, string> }) {
    const response = await fetch(`${API_BASE}/volumes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...options }),
    });
    return handleResponse(response);
  },

  async removeVolume(name: string, force = false) {
    const response = await fetch(`${API_BASE}/volumes/${name}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force }),
    });
    return handleResponse(response);
  },

  async pruneVolumes() {
    const response = await fetch(`${API_BASE}/volumes/prune`, { method: 'POST' });
    return handleResponse(response);
  },

  // Networks
  async getNetworks() {
    const response = await fetch(`${API_BASE}/networks`);
    return handleResponse(response);
  },

  async getNetwork(id: string) {
    const response = await fetch(`${API_BASE}/networks/${id}`);
    return handleResponse(response);
  },

  async createNetwork(
    name: string,
    options?: {
      driver?: string;
      internal?: boolean;
      attachable?: boolean;
      labels?: Record<string, string>;
      subnet?: string;
      gateway?: string;
    }
  ) {
    const response = await fetch(`${API_BASE}/networks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, ...options }),
    });
    return handleResponse(response);
  },

  async removeNetwork(id: string) {
    const response = await fetch(`${API_BASE}/networks/${id}`, { method: 'DELETE' });
    return handleResponse(response);
  },

  async connectContainer(networkId: string, containerId: string) {
    const response = await fetch(`${API_BASE}/networks/${networkId}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ containerId }),
    });
    return handleResponse(response);
  },

  async disconnectContainer(networkId: string, containerId: string, force = false) {
    const response = await fetch(`${API_BASE}/networks/${networkId}/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ containerId, force }),
    });
    return handleResponse(response);
  },

  async pruneNetworks() {
    const response = await fetch(`${API_BASE}/networks/prune`, { method: 'POST' });
    return handleResponse(response);
  },
};
