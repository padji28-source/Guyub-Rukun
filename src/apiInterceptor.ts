const getLocalCache = () => {
  try {
    const data = localStorage.getItem('api_cache');
    return data ? new Map(JSON.parse(data)) : new Map<string, { data: string, timestamp: number }>();
  } catch(e) {
    return new Map<string, { data: string, timestamp: number }>();
  }
};

const saveLocalCache = (map: Map<string, { data: string, timestamp: number }>) => {
  try {
    localStorage.setItem('api_cache', JSON.stringify(Array.from(map.entries())));
  } catch(e) {}
};

const cache = getLocalCache();
const inflight = new Map<string, Promise<Response>>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const isGet = !init || !init.method || init.method.toUpperCase() === 'GET';
  const url = typeof input === 'string' ? input : input.toString();

  // Clear cache on mutations (POST, PUT, DELETE)
  if (!isGet) {
    cache.clear();
    saveLocalCache(cache);
  } else {
    // 1. Check cache
    const cached = cache.get(url);
    // If cached, return immediately for instant UI, we will background fetch below if needed, but for now just return cache.
    // Wait, if we return cache, we won't background fetch if we just resolve?
    // The requirement says "no delay, langsung muncul". Returning cache resolves instantly.
    // However, if we return cache and don't do a background fetch, data might be stale.
    // We can do a background fetch but we can't easily wait if we already returned a promise. 
    // Let's just return the cache if it's within TTL.
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const mockRes = new Response(cached.data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      // apply custom json parser to mock res
      const originalJsonMock = mockRes.json.bind(mockRes);
      mockRes.json = async () => {
        try { return await originalJsonMock(); } catch (e) { return { data: [] }; }
      };
      
      // trigger background fetch to keep it fresh
      fetch(input, init).then(async (bgRes) => {
          if(bgRes.ok) {
              const text = await bgRes.text();
              if (!text.trim().startsWith('<')) {
                  cache.set(url, { data: text, timestamp: Date.now() });
                  saveLocalCache(cache);
              }
          }
      }).catch(e => {});

      return Promise.resolve(mockRes);
    }

    // 2. Check inflight requests
    if (inflight.has(url)) {
      const res = await inflight.get(url)!;
      const finalRes = res.clone();
      // apply custom json parser to cloned res
      const originalJsonCloned = finalRes.json.bind(finalRes);
      finalRes.json = async () => {
        const cloned = finalRes.clone();
        const text = await cloned.text();
        if (text.trim().startsWith('<')) {
          console.error('API Error: Expected JSON but got HTML for', url, text.substring(0, 100));
          return { data: [], users: [], notifications: [], error: 'Failed to parse JSON' };
        }
        return originalJsonCloned();
      };
      return finalRes;
    }
  }

  const modifiedInit = { ...init };

  // Append updaterName to POST/PUT payloads automatically
  if (!isGet && modifiedInit.body && typeof modifiedInit.body === 'string') {
    try {
      const parsed = JSON.parse(modifiedInit.body);
      if (typeof parsed === 'object' && !parsed.updaterName) {
        const authUser = localStorage.getItem('auth_user');
        if (authUser) {
          const userObj = JSON.parse(authUser);
          parsed.updaterName = userObj.nama || userObj.username || 'Admin';
          modifiedInit.body = JSON.stringify(parsed);
        }
      }
    } catch(e) {}
  }

  const fetchPromise = fetch(input, modifiedInit).then(async (res) => {
    if (isGet && res.ok) {
      const clonedForCache = res.clone();
      try {
        const text = await clonedForCache.text();
        if (!text.trim().startsWith('<')) {
          cache.set(url, { data: text, timestamp: Date.now() });
          saveLocalCache(cache);
        }
      } catch (e) {}
    }

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
  }).finally(() => {
    if (isGet) {
      inflight.delete(url);
    }
  });

  if (isGet) {
    inflight.set(url, fetchPromise);
  }

  return fetchPromise;
};
