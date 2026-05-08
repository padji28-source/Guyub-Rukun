import { useState, useEffect } from 'react';
import { apiFetch } from './apiInterceptor';

const getInitialCache = () => {
  try {
    const data = localStorage.getItem('use_fetch_cache');
    return data ? new Map(JSON.parse(data)) : new Map<string, any>();
  } catch(e) {
    return new Map<string, any>();
  }
};

const saveInitialCache = (map: Map<string, any>) => {
  try {
    localStorage.setItem('use_fetch_cache', JSON.stringify(Array.from(map.entries())));
  } catch(e) {}
};

const globalCache = getInitialCache();
const listeners = new Map<string, Set<(data: any) => void>>();

export function useFetch<T>(url: string | null) {
  const [data, setData] = useState<T | null>(url ? globalCache.get(url) || null : null);
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    
    if (!listeners.has(url)) {
      listeners.set(url, new Set());
    }
    const urlListeners = listeners.get(url)!;
    
    // Add local updater
    const onUpdate = (newData: any) => {
      if (isMounted) {
        setData(newData);
        setLoading(false);
      }
    };
    urlListeners.add(onUpdate);

    // Initial state based on cache
    if (globalCache.has(url)) {
      setLoading(false);
      setData(globalCache.get(url));
    } else {
      setLoading(true);
    }

    // Fetch data always to ensure freshness
    apiFetch(url)
      .then(res => res.json())
      .then(json => {
        const newData = json.data || json; // adjust based on API response structure
        globalCache.set(url, newData);
        saveInitialCache(globalCache);
        // notify all components listening to this url
        urlListeners.forEach(fn => fn(newData));
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      urlListeners.delete(onUpdate);
    };
  }, [url]);

  const mutate = (newData: T) => {
    if (!url) return;
    globalCache.set(url, newData);
    saveInitialCache(globalCache);
    const urlListeners = listeners.get(url);
    if (urlListeners) {
      urlListeners.forEach(fn => fn(newData));
    }
  };

  return { data, loading, error, mutate };
}
