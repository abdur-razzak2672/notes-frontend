import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

export function usePaged(path, limit = 10) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], meta: null });
  const [error, setError] = useState('');

  useEffect(() => setPage(1), [path]);

  const load = useCallback(async () => {
    const sep = path.includes('?') ? '&' : '?';
    try {
      const res = await api(`${path}${sep}page=${page}&limit=${limit}`);
      setResult(res);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [path, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...result, page, setPage, reload: load, error };
}
