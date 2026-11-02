const API = '/api';
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options, body: options.body === undefined ? undefined : JSON.stringify(options.body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The request failed. Please try again.');
  return data;
}
export const api = {
  get: path => request(path), post: (path, body = {}) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  register: body => request('/auth/register', { method: 'POST', body }),
  login: body => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' })
};
