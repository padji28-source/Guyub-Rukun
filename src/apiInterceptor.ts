export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const res = await fetch(input, init);
  const originalJson = res.json.bind(res);
  res.json = async () => {
    const cloned = res.clone();
    const text = await cloned.text();
    if (text.trim().startsWith('<')) {
      console.error('API Error: Expected JSON but got HTML for', input, text.substring(0, 100));
      return { data: [], users: [], notifications: [], error: 'Failed to parse JSON' };
    }
    return originalJson();
  };
  return res;
};
