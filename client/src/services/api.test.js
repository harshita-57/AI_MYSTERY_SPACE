import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from './api.js';

afterEach(() => vi.unstubAllGlobals());

describe('API client', () => {
  it('sends authenticated, JSON requests through the API prefix', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ status: 'ok' }) });
    vi.stubGlobal('fetch', fetchMock);
    await api.get('/health');
    expect(fetchMock).toHaveBeenCalledWith('/api/health', expect.objectContaining({ credentials: 'include', headers: { 'Content-Type': 'application/json' } }));
  });

  it('returns actionable API error messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'Case file unavailable.' }) }));
    await expect(api.get('/cases/missing')).rejects.toThrow('Case file unavailable.');
  });

  it('serializes mutation payloads as JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);
    await api.post('/auth/logout', {});
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST', body: '{}' });
  });
});
